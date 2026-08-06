import { useState } from "react"
import { useAuth } from "@/auth/use-auth"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, X, BookOpen, UserCircle, BarChart3 } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"

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
    'bg-error',
    'bg-error',
    'bg-brand-gold',
    'bg-brand-navy',
    'bg-success',
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
      setSuccess('Konto skapat! Kolla din e-post för att verifiera ditt konto.')
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
    <div className="min-h-screen flex font-body">
      {/* ── LEFT SIDE: Hero (dark navy, same pattern as public-site) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/deltagare_boostbyfcr_pa_trappa-scaled.jpg')" }}
        >
          <div className="absolute inset-0 bg-brand-navy/80" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <img src="/images/logo_boostbyfcr_dark.png" alt="Boost by FC Rosengård" className="h-10 mb-8" />
            <p className="text-brand-gold text-sm font-medium mb-4 tracking-wider">✦ SEDAN 2003</p>
            <h1 className="text-4xl font-display font-bold mb-2 leading-tight">
              Tillsammans öppnar<br />
              <span className="text-brand-gold">vi vägar framåt</span>
            </h1>
            <p className="text-white/70 max-w-md mt-4 text-sm leading-relaxed">
              Vi bygger förutsättningar som ger unga möjlighet att utvecklas,
              hitta riktning och forma sin framtid.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-input bg-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">Övningar & Handbok</p>
                <p className="text-xs text-white/60">Strukturerat metodmaterial</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-input bg-white/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">Kunskapsmaterial</p>
                <p className="text-xs text-white/60">För deltagare och handledare</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-input bg-white/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">Resultat & Uppföljning</p>
                <p className="text-xs text-white/60">Följ din utveckling</p>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-brand-gold">3 800+</p>
              <p className="text-xs text-white/60 tracking-wider">DELTAGARE</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-gold">20+</p>
              <p className="text-xs text-white/60 tracking-wider">ÅRS ERFARENHET</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-gold">98%</p>
              <p className="text-xs text-white/60 tracking-wider">NÖJDHET</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Login/Register Card (cream surface) ── */}
      <div className="w-full lg:w-1/2 bg-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-card border border-border p-8 shadow-md">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-input bg-brand-red/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-brand-red" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-display font-bold text-text text-center mb-2">
              {activeTab === 'login' ? 'Metodmaterial' : 'Skapa konto'}
            </h2>
            <p className="text-text-muted text-center text-sm mb-6">
              {activeTab === 'login'
                ? 'Logga in för att komma åt övningar, handbok och kunskapsmaterial'
                : 'Fyll i dina uppgifter för att skapa ett konto'}
            </p>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                onClick={() => { setActiveTab('login'); setError(''); setSuccess('') }}
                className={`flex-1 py-3 text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'text-brand-red border-b-2 border-brand-red'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Logga in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'register'}
                onClick={() => { setActiveTab('register'); setError(''); setSuccess('') }}
                className={`flex-1 py-3 text-sm font-medium transition-all ${
                  activeTab === 'register'
                    ? 'text-brand-red border-b-2 border-brand-red'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Skapa konto
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div role="alert" className="mb-4 p-3 rounded-input bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2">
                <X className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="alert" className="mb-4 p-3 rounded-input bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-text mb-1.5">
                    E-post
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                      placeholder="din@email.se"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-text mb-1.5">
                    Lösenord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                </div>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-red hover:text-brand-red/80 font-medium"
                  >
                    Glömt lösenord?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-brand-red hover:bg-brand-red/90 text-white font-semibold rounded-cta transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Logga in
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-text-muted">
                  Har du inget konto?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-brand-red hover:text-brand-red/80 font-medium"
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
                  <label htmlFor="reg-name" className="block text-sm font-medium text-text mb-1.5">
                    Namn
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                      placeholder="Ditt namn"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-text mb-1.5">
                    E-post
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                      placeholder="din@email.se"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-text mb-1.5">
                    Lösenord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
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

                  {/* Password Strength */}
                  {regPassword && (
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
                  <label htmlFor="reg-confirm" className="block text-sm font-medium text-text mb-1.5">
                    Bekräfta lösenord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="reg-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-input text-text placeholder:text-text-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                      aria-pressed={showConfirmPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regConfirmPassword && regPassword !== regConfirmPassword && (
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
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Skapa konto
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-text-muted">
                  Har du redan ett konto?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-brand-red hover:text-brand-red/80 font-medium"
                  >
                    Logga in
                  </button>
                </p>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-brand-gold text-lg">✦</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Back to home */}
            <a
              href="https://boost-public-site.pages.dev/"
              className="flex items-center justify-center gap-2 text-text-muted hover:text-text text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Tillbaka till startsidan
            </a>
          </div>

          <p className="text-center text-xs text-text-muted mt-6">
            Boost by FC Rosengård — Metodmaterial för deltagare
          </p>
        </div>
      </div>
    </div>
  )
}
