import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Check, X } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const { verifyEmail } = useAuth()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Ogiltig länk.')
      return
    }

    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setError(result.error || 'Verifiering misslyckades.')
      }
    })
  }, [token, verifyEmail])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#e0bd4a]/30 border-t-[#e0bd4a] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
        <div className="bg-[#243b55] rounded-2xl border border-white/10 p-8 text-center max-w-md">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">E-post verifierad!</h2>
          <p className="text-slate-400 text-sm mb-4">
            Din e-post är nu verifierad. Ditt konto väntar nu på godkännande från en administratör.
          </p>
          <p className="text-slate-500 text-xs mb-6">
            Du får ett e-postmeddelande när ditt konto har godkänts.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#e0bd4a] hover:bg-[#d4ad3f] text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            Till inloggning
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
      <div className="bg-[#243b55] rounded-2xl border border-white/10 p-8 text-center max-w-md">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <X className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Verifiering misslyckades</h2>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[#e0bd4a] hover:text-[#d4ad3f] text-sm font-medium"
        >
          Tillbaka till inloggning
        </Link>
      </div>
    </div>
  )
}