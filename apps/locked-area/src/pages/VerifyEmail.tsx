import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-6">
      <div className="bg-[#243b55] rounded-2xl border border-white/10 p-8 text-center max-w-md">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">E-post verifierad!</h2>
        <p className="text-slate-400 text-sm mb-6">
          Din e-post är verifierad! Du kan nu logga in.
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