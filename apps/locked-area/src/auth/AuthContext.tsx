import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ── Types ───────────────────────────────────────────────

interface Member {
  id: string
  name: string
  email: string
  isVerified: boolean
  isApproved: boolean
  user: 'USER' | 'ADMIN'
}

interface AuthContextValue {
  user: Member | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; verificationUrl?: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// ── Context ───────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

const HYGRAPH_ENDPOINT = import.meta.env.VITE_HYGRAPH_URL
const HYGRAPH_TOKEN = import.meta.env.VITE_HYGRAPH_TOKEN_LOCKED

// Use environment variable for Worker URL, fallback to local Express for dev
const WORKER_URL = import.meta.env.VITE_EMAIL_WORKER_URL;
if (!WORKER_URL) {
  console.error('❌ VITE_EMAIL_WORKER_URL is not set. Email sending will not work.');
}
// ── Provider ────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ── ONE-TIME CLEANUP: Remove old vulnerable fcr_user key ──
  useEffect(() => {
    const oldUser = localStorage.getItem('fcr_user')
    if (oldUser) {
      localStorage.removeItem('fcr_user')
      console.log('Cleared old vulnerable fcr_user data')
    }
  }, [])

  // ── Secure: Validate credentials against Hygraph on every load ──
  const validateSession = useCallback(async () => {
    const sessionEmail = localStorage.getItem('fcr_session_email')
    const sessionHash = localStorage.getItem('fcr_session_hash')

    if (!sessionEmail || !sessionHash) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(HYGRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${HYGRAPH_TOKEN}`,
        },
        body: JSON.stringify({
          query: `
            query GetMemberByEmail($email: String!) {
              members(where: { email: $email }) {
                id
                name
                email
                password
                isVerified
                isApproved
                user
              }
            }
          `,
          variables: { email: sessionEmail },
        }),
      })

      const { data } = await res.json()
      const members = data?.members

      if (!members || members.length === 0) {
        localStorage.removeItem('fcr_session_email')
        localStorage.removeItem('fcr_session_hash')
        setUser(null)
        setIsLoading(false)
        return
      }

      const found = members[0]

      if (found.password !== sessionHash) {
        localStorage.removeItem('fcr_session_email')
        localStorage.removeItem('fcr_session_hash')
        setUser(null)
        setIsLoading(false)
        return
      }

      if (!found.isVerified) {
        localStorage.removeItem('fcr_session_email')
        localStorage.removeItem('fcr_session_hash')
        setUser(null)
        setIsLoading(false)
        return
      }

      const memberData: Member = {
        id: found.id,
        name: found.name,
        email: found.email,
        isVerified: found.isVerified,
        isApproved: found.isApproved,
        user: found.user,
      }

      setUser(memberData)
    } catch (err) {
      console.error('Session validation error:', err)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    validateSession()
  }, [validateSession])

  useEffect(() => {
    const handleFocus = () => validateSession()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [validateSession])

  const hygraphFetch = async (query: string, variables?: Record<string, unknown>) => {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HYGRAPH_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    })
    return res.json()
  }

  const hashPassword = (password: string): string => {
    let hash = 0
    const str = password + 'fcr-salt-2026'
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & 0xFFFFFFFF
    }
    const hex = (hash >>> 0).toString(16).padStart(16, '0')
    return hex.repeat(4)
  }

  const generateToken = (): string => {
    const array = new Uint8Array(32)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array)
    } else {
      for (let i = 0; i < 32; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  // ── Login ───────────────────────────────────────────

  const login = async (email: string, password: string) => {
    try {
      const hashedPassword = hashPassword(password)

      const { data, errors } = await hygraphFetch(
        `query GetMemberByEmail($email: String!) {
          members(where: { email: $email }) {
            id
            name
            email
            password
            isVerified
            isApproved
            user 
          }
        }`,
        { email }
      )

      if (errors) {
        console.error('GraphQL errors:', JSON.stringify(errors, null, 2))
        return { success: false, error: errors[0]?.message || 'Databasfel. Försök igen.' }
      }

      const members = data?.members
      if (!members || members.length === 0) {
        return { success: false, error: 'Felaktig e-post eller lösenord' }
      }

      const found = members[0]

      if (found.password !== hashedPassword) {
        return { success: false, error: 'Felaktig e-post eller lösenord' }
      }

      if (!found.isVerified) {
        return { success: false, error: 'Ditt konto är inte verifierat. Kontrollera din e-post och klicka på verifieringslänken.' }
      }

      if (!found.isApproved) {
        return { success: false, error: 'Ditt konto väntar på godkännande från administratören.' }
      }

      const memberData: Member = {
        id: found.id,
        name: found.name,
        email: found.email,
        isVerified: found.isVerified,
        isApproved: found.isApproved,
        user: found.user,
      }

      localStorage.setItem('fcr_session_email', memberData.email)
      localStorage.setItem('fcr_session_hash', found.password)

      setUser(memberData)
      return { success: true }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: 'Ett fel uppstod. Försök igen.' }
    }
  }

  // ── Register ────────────────────────────────────────

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data: existing } = await hygraphFetch(
        `query CheckEmail($email: String!) {
          members(where: { email: $email }) { id }
        }`,
        { email }
      )

      if (existing?.members?.length > 0) {
        return { success: false, error: 'E-postadressen är redan registrerad' }
      }

      const hashedPassword = hashPassword(password)
      const verificationToken = generateToken()

      const { data, errors } = await hygraphFetch(
        `mutation CreateMember($name: String!, $email: String!, $password: String!, $verificationToken: String!) {
          createMember(data: {
            name: $name
            email: $email
            password: $password
            verificationToken: $verificationToken
            isVerified: false
            isApproved: false
            user: ADMIN
          }) {
            id
            email
          }
        }`,
        { name, email, password: hashedPassword, verificationToken }
      )

      if (errors) {
        console.error('GraphQL errors:', JSON.stringify(errors, null, 2))
        return { success: false, error: 'Kunde inte skapa konto. Försök igen.' }
      }

      if (!data?.createMember) {
        return { success: false, error: 'Kunde inte skapa konto. Försök igen.' }
      }

      const memberId = data.createMember.id
      const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`

      // ── Send verification email via Worker ──
      try {
        console.log('📧 Sending verification email to:', email)

        const res = await fetch(`${WORKER_URL}/send-verification-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            name: name,
            verificationUrl: verificationUrl,
          }),
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('❌ Email API error:', res.status, errorText)
        } else {
          console.log('✅ Verification email sent via Worker')
        }
      } catch (err) {
        console.error('❌ Failed to send verification email:', err)
      }

      // ── Publish the member ──
      await hygraphFetch(
        `mutation PublishMember($id: ID!) {
          publishMember(where: { id: $id }) {
            id
          }
        }`,
        { id: memberId }
      )

      return { success: true, verificationUrl }

    } catch (err) {
      console.error('Register error:', err)
      return { success: false, error: 'Ett fel uppstod. Försök igen.' }
    }
  }

  // ── Verify Email ────────────────────────────────────

  const verifyEmail = async (token: string) => {
    try {
      const { data } = await hygraphFetch(
        `query GetMemberByVerificationToken($token: String!) {
          members(where: { verificationToken: $token }) {
            id
            name
            email
            verificationToken
            isVerified
          }
        }`,
        { token }
      )

      const members = data?.members
      if (!members || members.length === 0) {
        return { success: false, error: 'Ogiltig eller utgången verifieringslänk.' }
      }

      const found = members[0]

      if (found.isVerified) {
        return { success: true }
      }

      await hygraphFetch(
        `mutation VerifyMember($id: ID!) {
          updateMember(where: { id: $id }, data: {
            isVerified: true
            verificationToken: null
          }) {
            id
          }
        }`,
        { id: found.id }
      )

      await hygraphFetch(
        `mutation PublishMember($id: ID!) {
          publishMember(where: { id: $id }) {
            id
          }
        }`,
        { id: found.id }
      )

      return { success: true }
    } catch (err) {
      console.error('Verify email error:', err)
      return { success: false, error: 'Ett fel uppstod vid verifiering.' }
    }
  }

  // ── Request Password Reset ───────────────────────────

  const requestPasswordReset = async (email: string) => {
    try {
      const { data } = await hygraphFetch(
        `query GetMemberByEmail($email: String!) {
          members(where: { email: $email }) {
            id
            name
            email
          }
        }`,
        { email }
      )

      const members = data?.members
      if (!members || members.length === 0) {
        return { success: true }
      }

      const found = members[0]
      const token = generateToken()
      const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString()

      await hygraphFetch(
        `mutation UpdateMemberResetToken($id: ID!, $token: String!, $expiry: DateTime!) {
          updateMember(where: { id: $id }, data: {
            resetToken: $token
            resetTokenExpiry: $expiry
          }) {
            id
          }
        }`,
        { id: found.id, token, expiry }
      )

      await hygraphFetch(
        `mutation PublishMember($id: ID!) {
          publishMember(where: { id: $id }) {
            id
          }
        }`,
        { id: found.id }
      )

      const resetUrl = `${window.location.origin}/reset-password?token=${token}`

      // ── Send password reset email via Worker ──
      try {
        console.log('📧 Sending password reset email to:', found.email)

        const res = await fetch(`${WORKER_URL}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: found.email,
            name: found.name,
            subject: 'Återställ ditt lösenord',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e3a5f;">Återställ ditt lösenord</h2>
                <p>Hej ${found.name},</p>
                <p>Du har begärt att återställa ditt lösenord. Klicka på länken nedan:</p>
                <p style="margin: 24px 0;">
                  <a href="${resetUrl}" style="background: #e0bd4a; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Återställ lösenord
                  </a>
                </p>
                <p style="color: #999; font-size: 12px;">Länken är giltig i 1 timme.</p>
              </div>
            `,
          }),
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('❌ Password reset email error:', res.status, errorText)
        } else {
          console.log('✅ Password reset email sent via Worker')
        }
      } catch (err) {
        console.error('❌ Failed to send password reset email:', err)
      }

      return { success: true }
    } catch (err) {
      console.error('Password reset request error:', err)
      return { success: false, error: 'Kunde inte skicka återställningslänk.' }
    }
  }

  // ── Reset Password ───────────────────────────────────

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const { data } = await hygraphFetch(
        `query GetMemberByResetToken($token: String!) {
          members(where: { resetToken: $token }) {
            id
            email
            resetToken
            resetTokenExpiry
          }
        }`,
        { token }
      )

      const members = data?.members
      if (!members || members.length === 0) {
        return { success: false, error: 'Ogiltig eller utgången länk.' }
      }

      const found = members[0]
      const now = new Date()
      const expiry = new Date(found.resetTokenExpiry)

      if (now > expiry) {
        return { success: false, error: 'Länken har utgått. Begär en ny återställning.' }
      }

      const hashedPassword = hashPassword(newPassword)

      await hygraphFetch(
        `mutation UpdatePassword($id: ID!, $password: String!) {
          updateMember(where: { id: $id }, data: {
            password: $password
            resetToken: null
            resetTokenExpiry: null
          }) {
            id
          }
        }`,
        { id: found.id, password: hashedPassword }
      )

      await hygraphFetch(
        `mutation PublishMember($id: ID!) {
          publishMember(where: { id: $id }) {
            id
          }
        }`,
        { id: found.id }
      )

      return { success: true }
    } catch (err) {
      console.error('Reset password error:', err)
      return { success: false, error: 'Ett fel uppstod.' }
    }
  }

  // ── Logout ──────────────────────────────────────────

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fcr_session_email')
    localStorage.removeItem('fcr_session_hash')
    localStorage.removeItem('fcr_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.email === 'moh17670s@gmail.com',
        isLoading,
        login,
        register,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}