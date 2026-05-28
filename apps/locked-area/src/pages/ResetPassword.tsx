import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Lock, Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react'

interface PasswordRequirement {
  label: string
  met: boolean
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passwordRequirements: PasswordRequirement[] = [
    { label: 'Minst 8 tecken', met: newPassword.length >= 8 },
    { label: 'En stor bokstav', met: /[A-Z]/.test(newPassword) },
    { label: 'En siffra', met: /[0-9]/.test(newPassword) },
    { label: 'Ett specialtecken (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ]

  const strengthScore = passwordRequirements.filter((r) => r.met).length
  const strengthLabel = ['Svag', 'Svag', 'Medel', 'Stark', 'Mycket stark'][strengthScore]
  const strengthColor = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strengthScore]

  useEffect(() => {
    if (!token) {
      setError('Ogiltig länk. Begär en ny återställning.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Ogiltig länk.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    if (strengthScore < 4) {
      setError('Lösenordet uppfyller inte alla krav')
      return
    }

    setIsLoading(true)
    const result = await resetPassword(token, newPassword)
    setIsLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } else {
      setError(result.error || 'Ett fel uppstod.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#243b55] rounded-2xl border border-white/10 p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Lösenord uppdaterat!</h2>
          <p className="text-slate-400 text-sm mb-4">
            Ditt lösenord har ändrats. Du omdirigeras till inloggningen...
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#e0bd4a] hover:text-[#d4ad3f] text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Gå till inloggning
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-[#243b55] rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Nytt lösenord</h2>
          <p className="text-slate-400 text-center text-sm mb-6">
            Välj ett nytt lösenord för ditt konto.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nytt lösenord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${(strengthScore / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-20 text-right">{strengthLabel}</span>
                  </div>
                  <div className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-1.5 text-xs">
                        {req.met ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <X className="w-3 h-3 text-slate-500" />
                        )}
                        <span className={req.met ? 'text-green-400' : 'text-slate-400'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Bekräfta lösenord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Lösenorden matchar inte</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || strengthScore < 4}
              className="w-full py-2.5 bg-[#e0bd4a] hover:bg-[#d4ad3f] text-slate-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                'Uppdatera lösenord'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till inloggning
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}