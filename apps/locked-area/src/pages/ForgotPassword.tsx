import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Mail, ArrowLeft, Check, X } from 'lucide-react'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await requestPasswordReset(email)
    setIsLoading(false)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Ett fel uppstod. Försök igen.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#243b55] rounded-2xl border border-white/10 p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">E-post skickad!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Om ett konto finns med denna e-postadress har vi skickat en återställningslänk. Kontrollera din inkorg (och skräppost).
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#e0bd4a] hover:text-[#d4ad3f] text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till inloggning
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-[#243b55] rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Glömt lösenord?</h2>
          <p className="text-slate-400 text-center text-sm mb-6">
            Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">E-post</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                  placeholder="din@email.se"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#e0bd4a] hover:bg-[#d4ad3f] text-slate-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                'Skicka återställningslänk'
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