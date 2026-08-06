import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Lock, Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react"

interface PasswordRequirement {
  label: string
  met: boolean
}

export default function ResetPassword() {
  const navigate = useNavigate()
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
  const strengthColor = ['bg-error', 'bg-error', 'bg-brand-gold', 'bg-brand-navy', 'bg-success'][strengthScore]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    if (strengthScore < 4) {
      setError('Lösenordet uppfyller inte alla krav')
      return
    }

    setIsLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setIsLoading(false)

    if (updateError) {
      setError(updateError.message || 'Ett fel uppstod.')
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <div className="w-full max-w-md bg-white rounded-card border border-border p-8 text-center shadow-md">
          <div className="w-12 h-12 rounded-input bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-xl font-display font-bold text-text mb-2">Lösenord uppdaterat!</h2>
          <p className="text-text-muted text-sm mb-4">
            Ditt lösenord har ändrats. Du omdirigeras till inloggningen...
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red/80 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Gå till inloggning
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card border border-border p-8 shadow-md">
          <h2 className="text-2xl font-display font-bold text-text text-center mb-2">Nytt lösenord</h2>
          <p className="text-text-muted text-center text-sm mb-6">
            Välj ett nytt lösenord för ditt konto.
          </p>

          {error && (
            <div role="alert" className="mb-4 p-3 rounded-input bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-password" className="block text-sm font-medium text-text mb-1.5">
                Nytt lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${(strengthScore / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted w-20 text-right">{strengthLabel}</span>
                  </div>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li key={req.label} className="flex items-center gap-1.5 text-xs">
                        {req.met ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <X className="w-3 h-3 text-text-muted" />
                        )}
                        <span className={req.met ? 'text-success' : 'text-text-muted'}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="reset-confirm" className="block text-sm font-medium text-text mb-1.5">
                Bekräfta lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-error">Lösenorden matchar inte</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || strengthScore < 4}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red/90 text-white font-semibold rounded-cta transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Uppdatera lösenord'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text text-sm transition-colors"
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
