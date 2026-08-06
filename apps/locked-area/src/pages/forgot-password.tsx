import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/auth/use-auth"
import { Mail, ArrowLeft, Check, X } from "lucide-react"

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await resetPassword(email)
    setIsLoading(false)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Ett fel uppstod. Försök igen.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <div className="w-full max-w-md bg-white rounded-card border border-border p-8 text-center shadow-md">
          <div className="w-12 h-12 rounded-input bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-xl font-display font-bold text-text mb-2">E-post skickad!</h2>
          <p className="text-text-muted text-sm mb-6">
            Om ett konto finns med denna e-postadress har vi skickat en återställningslänk. Kontrollera din inkorg (och skräppost).
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red/80 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till inloggning
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card border border-border p-8 shadow-md">
          <h2 className="text-2xl font-display font-bold text-text text-center mb-2">Glömt lösenord?</h2>
          <p className="text-text-muted text-center text-sm mb-6">
            Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.
          </p>

          {error && (
            <div role="alert" className="mb-4 p-3 rounded-input bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-text mb-1.5">
                E-post
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                  placeholder="din@email.se"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red/90 text-white font-semibold rounded-cta transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Skicka återställningslänk'
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
