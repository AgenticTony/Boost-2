import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, X, BookOpen, UserCircle, BarChart3 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

type Tab = 'login' | 'register'

interface PasswordRequirement {
  label: string
  met: boolean
}

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationUrl, setVerificationUrl] = useState('')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const passwordRequirements: PasswordRequirement[] = [
    { label: 'Minst 8 tecken', met: regPassword.length >= 8 },
    { label: 'En stor bokstav', met: /[A-Z]/.test(regPassword) },
    { label: 'En siffra', met: /[0-9]/.test(regPassword) },
    { label: 'Ett specialtecken (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(regPassword) },
  ]

  const strengthScore = passwordRequirements.filter((r) => r.met).length
  const strengthLabel = ['Svag', 'Svag', 'Medel', 'Stark', 'Mycket stark'][strengthScore]
  const strengthColor = [
    'bg-red-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ][strengthScore]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(loginEmail, loginPassword)
    setIsLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Inloggning misslyckades')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setVerificationUrl('')

    if (regPassword !== regConfirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    if (strengthScore < 4) {
      setError('Lösenordet uppfyller inte alla krav')
      return
    }

    setIsLoading(true)
    const result = await register(regName, regEmail, regPassword)
    setIsLoading(false)

    if (result.success) {
      setSuccess('Konto skapat! Klicka på länken nedan för att verifiera din e-post:')
      setVerificationUrl(result.verificationUrl || '')
      setRegName('')
      setRegEmail('')
      setRegPassword('')
      setRegConfirmPassword('')
      setActiveTab('login')
    } else {
      setError(result.error || 'Registrering misslyckades')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT SIDE: Hero ── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/deltagare_boostbyfcr_pa_trappa-scaled.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#1e3a5f]/80" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <img src="/images/logo_boostbyfcr_dark.png" alt="Boost by FC Rosengård" className="h-10 mb-8" />
            <p className="text-[#e0bd4a] text-sm font-medium mb-4 tracking-wider">✦ SEDAN 2003</p>
            <h1 className="text-4xl font-bold mb-2 leading-tight">
              Tillsammans öppnar<br />
              <span className="text-[#e0bd4a]">vi vägar framåt</span>
            </h1>
            <p className="text-slate-300 max-w-md mt-4 text-sm leading-relaxed">
              Vi bygger förutsättningar som ger unga möjlighet att utvecklas, 
              hitta riktning och forma sin framtid.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#e0bd4a]" />
              </div>
              <div>
                <p className="font-medium text-sm">Övningar & Handbok</p>
                <p className="text-xs text-slate-400">Strukturerat metodmaterial</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-[#e0bd4a]" />
              </div>
              <div>
                <p className="font-medium text-sm">Kunskapsmaterial</p>
                <p className="text-xs text-slate-400">För deltagare och handledare</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#e0bd4a]" />
              </div>
              <div>
                <p className="font-medium text-sm">Resultat & Uppföljning</p>
                <p className="text-xs text-slate-400">Följ din utveckling</p>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-[#e0bd4a]">3 800+</p>
              <p className="text-xs text-slate-400 tracking-wider">DELTAGARE</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e0bd4a]">20+</p>
              <p className="text-xs text-slate-400 tracking-wider">ÅRS ERFARENHET</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e0bd4a]">98%</p>
              <p className="text-xs text-slate-400 tracking-wider">NÖJDHET</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Login/Register Card ── */}
      <div className="w-full lg:w-1/2 bg-[#1e3a5f] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#243b55] rounded-2xl border border-white/10 p-8">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#e0bd4a]" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {activeTab === 'login' ? 'Metodmaterial' : 'Skapa konto'}
            </h2>
            <p className="text-slate-400 text-center text-sm mb-6">
              {activeTab === 'login' 
                ? 'Logga in för att komma åt övningar, handbok och kunskapsmaterial' 
                : 'Fyll i dina uppgifter för att skapa ett konto'}
            </p>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); setVerificationUrl('') }}
                className={`flex-1 py-3 text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'text-[#e0bd4a] border-b-2 border-[#e0bd4a]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Logga in
              </button>
              <button
  onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); setVerificationUrl('') }}
  className={`flex-1 py-3 text-sm font-medium transition-all ${
    activeTab === 'register'
      ? 'text-[#e0bd4a] border-b-2 border-[#e0bd4a]'
      : 'text-slate-400 hover:text-slate-200'
  }`}
>
  Skapa konto
</button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}
            {success && verificationUrl && (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                <p className="mb-2">{success}</p>
                <a 
                  href={verificationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#e0bd4a] hover:text-[#d4ad3f] font-medium underline break-all"
                >
                  {verificationUrl}
                </a>
              </div>
            )}
            {success && !verificationUrl && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">E-post</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                      placeholder="din@email.se"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Lösenord</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                </div>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#e0bd4a] hover:text-[#d4ad3f] font-medium"
                  >
                    Glömt lösenord?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#e0bd4a] hover:bg-[#d4ad3f] text-slate-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Logga in
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Har du inget konto?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-[#e0bd4a] hover:text-[#d4ad3f] font-medium"
                  >
                    Skapa ett här
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Namn</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                      placeholder="Ditt namn"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">E-post</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                      placeholder="din@email.se"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Lösenord</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
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

                  {/* Password Strength */}
                  {regPassword && (
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e0bd4a]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regConfirmPassword && regPassword !== regConfirmPassword && (
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
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Skapa konto
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Har du redan ett konto?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-[#e0bd4a] hover:text-[#d4ad3f] font-medium"
                  >
                    Logga in
                  </button>
                </p>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#e0bd4a] text-lg">✦</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Back to home */}
            <a
              href="https://boost-public-site.pages.dev/"
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Tillbaka till startsidan
            </a>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Boost by FC Rosengård — Metodmaterial för deltagare
          </p>
        </div>
      </div>
    </div>
  )
}