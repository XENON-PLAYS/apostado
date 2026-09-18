import { FormEvent, useEffect, useRef, useState } from 'react'
import { Activity as ActivityIcon, ArrowRight, Bell, Bot, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Eye, EyeOff, Gamepad2, Gauge, KeyRound, LayoutDashboard, LockKeyhole, LogOut, Menu, MessageSquareText, MousePointerClick, Music2, Pause, Play, Save, Server, Settings2, ShieldCheck, Sparkles, Square, UsersRound, Volume2, VolumeX, WandSparkles, X, Zap } from 'lucide-react'
import { supabase } from './lib/supabase'

type View = 'home' | 'login' | 'register' | 'dashboard'
type User = { id: string; name: string; key: string; expiresAt: string; role: string }

const accountEmail = (name: string) => `${name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')}@adquirabot.app`

const features = [
  { icon: UsersRound, title: 'Filas automatizadas', text: 'Organize entradas e mantenha suas partidas sempre em movimento, sem trabalho manual.' },
  { icon: MessageSquareText, title: 'Mensagens inteligentes', text: 'Envie avisos e divulgações para sua comunidade de forma rápida e organizada.' },
  { icon: Bot, title: 'Marcação de jogadores', text: 'Encontre e marque jogadores com poucos cliques para lotar seus eventos.' },
]

const plans = [
  { name: 'Diário', period: '24 horas', price: 'R$ 4,90', detail: 'Ideal para testar todos os recursos.' },
  { name: 'Semanal', period: '7 dias', price: 'R$ 19,90', detail: 'Para comunidades em crescimento.', popular: true },
  { name: 'Mensal', period: '30 dias', price: 'R$ 49,90', detail: 'Automação contínua e melhor custo.' },
]

const tracks = [
  { title: 'New Day', artist: 'Ikson', src: './music/new-day.mp3' },
  { title: 'Warm Nights', artist: 'LAKEY INSPIRED', src: './music/warm-nights.mp3' },
  { title: 'Chill Day', artist: 'LAKEY INSPIRED', src: './music/chill-day.mp3' },
]

async function loadProfile(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('profiles').select('id, name, access_key, expires_at, role').eq('id', id).single()
  if (error || !data) return null
  return { id: data.id, name: data.name, key: data.access_key, expiresAt: data.expires_at, role: data.role }
}

function formatRemaining(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (ms <= 0) return 'Expirada'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  return days > 0 ? `${days}d ${hours}h restantes` : `${hours}h restantes`
}

function App() {
  const [view, setView] = useState<View>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [session, setSession] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) setSession(await loadProfile(data.session.user.id))
    })
    const { data } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (!authSession) setSession(null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const navigate = (next: View) => {
    setNotice('')
    setMenuOpen(false)
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('home')
  }

  if (view === 'login' || view === 'register') {
    return <AuthPage mode={view} onNavigate={navigate} onNotice={setNotice} notice={notice} onLogin={(user) => { setSession(user); navigate('dashboard') }} />
  }

  if (view === 'dashboard' && session) {
    return <Dashboard user={session} onLogout={logout} />
  }

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-zinc-100 grid-bg">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-[0_0_24px_rgba(124,92,252,.35)]"><Bot size={22} /></span>
            <span className="text-lg">ADQUIRA<span className="text-primary">BOT</span></span>
          </button>
          <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a className="transition hover:text-white" href="#recursos">Recursos</a>
            <a className="transition hover:text-white" href="#planos">Planos</a>
            <a className="transition hover:text-white" href="#como-funciona">Como funciona</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button onClick={() => navigate('login')} className="px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white">Entrar</button>
            <button onClick={() => navigate('register')} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold transition hover:bg-violet-500">Criar conta</button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
        {menuOpen && <div className="border-t border-white/5 bg-panel p-5 md:hidden"><div className="flex flex-col gap-4"><a href="#recursos">Recursos</a><a href="#planos">Planos</a><button onClick={() => navigate('login')} className="text-left">Entrar</button><button onClick={() => navigate('register')} className="rounded-xl bg-primary p-3 font-bold">Criar conta</button></div></div>}
      </header>

      <main>
        <section className="relative mx-auto flex min-h-[820px] max-w-7xl items-center px-5 pb-20 pt-32 lg:px-8">
          <div className="glow pulse-ring absolute -right-52 top-20 h-[760px] w-[760px]" />
          <div className="absolute left-[42%] top-24 h-72 w-72 rounded-full bg-cyan-400/[.035] blur-[100px]" />
          <div className="relative z-10 grid w-full items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <div className="reveal-up mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[.08] px-4 py-2 text-xs font-semibold text-violet-300 shadow-[0_0_30px_rgba(124,92,252,.08)]"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span> AUTOMAÇÃO ATIVA 24 HORAS</div>
              <h1 className="reveal-up reveal-delay-1 max-w-3xl text-5xl font-extrabold leading-[1.03] tracking-[-.05em] sm:text-6xl lg:text-[72px]">Sua comunidade merece <span className="hero-word">muito mais alcance.</span></h1>
              <p className="reveal-up reveal-delay-2 mt-7 max-w-xl text-lg leading-8 text-zinc-400">Filas, mensagens e jogadores trabalhando em sintonia. O Adquira Bot transforma tarefas repetitivas em crescimento automático.</p>
              <div className="reveal-up reveal-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => navigate('register')} className="shine group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-7 py-4 font-bold shadow-[0_14px_40px_rgba(124,92,252,.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(124,92,252,.42)]">Começar agora <ArrowRight size={19} className="transition duration-300 group-hover:translate-x-1" /></button>
                <a href="#recursos" className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-7 py-4 text-center font-semibold backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.07]"><Sparkles size={17} className="text-primary transition group-hover:rotate-12" /> Explorar recursos</a>
              </div>
              <div className="reveal-up reveal-delay-3 mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-zinc-500"><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Ativação instantânea</span><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Painel completo</span><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Configuração simples</span></div>
            </div>
            <div className="reveal-up reveal-delay-2 relative mx-auto w-full max-w-lg">
              <div className="orbit-dot absolute left-1/2 top-1/2 z-20 hidden h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_#67e8f9] sm:block" />
              <div className="absolute -inset-10 rounded-full border border-primary/[.08]" /><div className="absolute -inset-4 rounded-[40px] border border-white/[.04]" />
              <div className="float relative rounded-[28px] border border-white/[.12] bg-[#10141d]/85 p-3 shadow-[0_30px_100px_rgba(0,0,0,.5),0_0_70px_rgba(124,92,252,.12)] backdrop-blur-xl">
                <div className="absolute inset-x-16 -top-px h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                <div className="rounded-2xl border border-white/[.06] bg-[#090d14]/95 p-6">
                  <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-3"><span className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/25"><Bot size={23} /><span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-[#090d14] bg-emerald-400" /></span><div><p className="font-bold">Adquira Bot</p><p className="mt-0.5 text-[11px] text-zinc-500">Sistema operacional</p></div></div><span className="rounded-lg border border-emerald-400/10 bg-emerald-400/[.07] px-3 py-2 text-[10px] font-bold tracking-wider text-emerald-300">ONLINE</span></div>
                  <div className="grid grid-cols-2 gap-3"><Metric value="1.284" label="Membros alcançados" /><Metric value="96%" label="Taxa de entrega" /></div>
                  <div className="mt-4 rounded-xl border border-white/[.06] bg-white/[.025] p-4"><div className="mb-4 flex justify-between text-sm"><span className="font-medium">Fila da comunidade</span><span className="font-bold text-primary">18/20</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="progress-animate h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_12px_rgba(124,92,252,.4)]" /></div><div className="mt-5 space-y-3"><Activity text="12 jogadores foram marcados" time="agora" /><Activity text="Mensagem enviada com sucesso" time="2 min" /><Activity text="Nova entrada na fila" time="4 min" /></div></div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-8 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#111722]/90 p-3 shadow-2xl backdrop-blur-xl sm:flex"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400"><Zap size={17} /></span><div><p className="text-xs font-bold">Automação concluída</p><p className="mt-0.5 text-[10px] text-zinc-600">+24 membros alcançados</p></div></div>
            </div>
          </div>
        </section>

        <section id="recursos" className="border-y border-white/5 bg-white/[.015] py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="RECURSOS" title="Tudo para sua comunidade crescer" text="Automação simples, eficiente e feita para você ganhar tempo." /><div className="mt-14 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-7 transition duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_22px_60px_rgba(0,0,0,.25)]"><span className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/0 blur-2xl transition duration-500 group-hover:bg-primary/10" /><span className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white"><Icon /></span><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{text}</p></div>)}</div></div>
        </section>

        <section id="como-funciona" className="relative overflow-hidden py-28"><div className="pointer-events-none absolute left-1/2 top-1/2 h-[580px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[.055] blur-[150px]" /><div className="relative mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="SIMPLES DO INÍCIO AO FIM" title="Sua automação pronta em 3 passos" text="Sem configurações confusas. Você entra, personaliza e deixa o Adquira Bot trabalhar." /><div className="relative mt-14"><div className="absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-white/[.08] lg:block"><span className="absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-primary/20 to-primary/60" /><span className="absolute right-0 top-0 h-px w-1/2 bg-gradient-to-r from-primary/60 to-primary/20" /></div><div className="grid gap-5 lg:grid-cols-3"><HowStep number="01" icon={<MousePointerClick size={22} />} title="Crie seu acesso" text="Cadastre seu nome, defina uma senha segura e entre no seu painel exclusivo." tags={['Cadastro rápido', 'Acesso seguro']} /><HowStep number="02" icon={<KeyRound size={22} />} title="Ative sua licença" text="Insira sua key de acesso e tenha todos os recursos liberados automaticamente." tags={['Ativação imediata', 'Acesso protegido']} /><HowStep number="03" icon={<WandSparkles size={22} />} title="Personalize e inicie" text="Escolha filas, mensagens e presença. Depois é só iniciar e acompanhar tudo." tags={['Configuração visual', 'Controle total']} /></div></div><div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-2xl border border-primary/15 bg-primary/[.045] p-5 sm:flex-row sm:px-7"><div className="flex items-center gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-400/15 bg-emerald-400/[.08] text-emerald-400"><CheckCircle2 size={20} /></span><div><p className="text-sm font-bold text-zinc-200">Tudo pronto para começar</p><p className="mt-1 text-xs text-zinc-500">Configure seu bot em menos de dois minutos.</p></div></div><button onClick={() => navigate('register')} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-violet-500 sm:w-auto">Criar minha conta <ArrowRight size={16} className="transition group-hover:translate-x-1" /></button></div></div></section>

        <section id="planos" className="border-y border-white/5 bg-white/[.015] py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="PLANOS" title="Escolha seu tempo de acesso" text="Opções flexíveis para cada fase da sua comunidade." /><div className="mt-14 grid items-center gap-5 md:grid-cols-3">{plans.map((plan) => <div key={plan.name} className={`relative rounded-2xl border p-7 ${plan.popular ? 'border-primary bg-primary/[.07] shadow-xl shadow-primary/10 md:-translate-y-3' : 'border-white/10 bg-panel'}`}>{plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold">MAIS ESCOLHIDO</span>}<h3 className="text-xl font-bold">{plan.name}</h3><p className="mt-2 text-sm text-zinc-500">{plan.period}</p><p className="mt-6 text-3xl font-extrabold">{plan.price}</p><p className="mt-4 text-zinc-400">{plan.detail}</p><button onClick={() => navigate('register')} className={`mt-7 w-full rounded-xl p-3 font-bold transition ${plan.popular ? 'bg-primary hover:bg-violet-500' : 'bg-white/5 hover:bg-white/10'}`}>Começar agora</button></div>)}</div></div></section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-10 text-sm text-zinc-500 sm:flex-row lg:px-8"><div className="flex items-center gap-2 font-bold text-zinc-300"><Bot size={18} className="text-primary" /> ADQUIRABOT</div><p>© 2026 Adquira Bot. Todos os direitos reservados.</p></footer>
      <MusicPlayer />
    </div>
  )
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  const play = () => {
    if (!audioRef.current) return
    if (playing) audioRef.current.pause()
    else audioRef.current.play().catch(() => setPlaying(false))
  }

  const changeTrack = (direction: number) => {
    setTrack((current) => (current + direction + tracks.length) % tracks.length)
    setPlaying(true)
  }

  useEffect(() => {
    if (playing) audioRef.current?.play().catch(() => setPlaying(false))
  }, [track])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.45
    if (localStorage.getItem('adquira-music-visited')) return
    localStorage.setItem('adquira-music-visited', 'true')
    setOpen(true)
    const start = () => {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => undefined)
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {
      window.addEventListener('pointerdown', start, { once: true })
      window.addEventListener('keydown', start, { once: true })
    })
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
  }, [])

  const updateProgress = () => {
    const audio = audioRef.current
    if (audio?.duration) setProgress((audio.currentTime / audio.duration) * 100)
  }

  return <div className="fixed bottom-5 right-5 z-50"><audio ref={audioRef} src={tracks[track].src} muted={muted} onTimeUpdate={updateProgress} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => changeTrack(1)} /><div className={`relative flex items-center overflow-hidden rounded-2xl border border-white/10 bg-[#101621]/95 shadow-[0_18px_60px_rgba(0,0,0,.5)] backdrop-blur-xl transition-all duration-500 ${open ? 'w-[330px] p-2.5' : 'w-12 p-1.5'}`}><span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5"><span className="block h-full bg-gradient-to-r from-primary to-cyan-400 transition-[width]" style={{ width: `${progress}%` }} /></span><button onClick={() => setOpen(!open)} className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20 ${playing ? 'pulse-ring' : ''}`}><Music2 size={17} />{playing && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#101621] bg-emerald-400" />}</button>{open && <div className="ml-3 flex min-w-0 flex-1 items-center gap-2"><div className="min-w-0 flex-1"><div className="mb-1 flex items-center gap-1"><span className="h-2 w-0.5 animate-pulse bg-primary" /><span className="h-3 w-0.5 animate-pulse bg-violet-400 [animation-delay:150ms]" /><span className="h-1.5 w-0.5 animate-pulse bg-cyan-400 [animation-delay:300ms]" /><p className="ml-1 truncate text-xs font-bold text-zinc-200">{tracks[track].title}</p></div><p className="truncate text-[9px] uppercase tracking-wider text-zinc-600">{tracks[track].artist}</p></div><button onClick={() => changeTrack(-1)} className="text-zinc-600 transition hover:text-white"><ChevronLeft size={16} /></button><button onClick={play} className="grid h-8 w-8 place-items-center rounded-lg bg-white/[.06] text-white transition hover:bg-primary">{playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}</button><button onClick={() => changeTrack(1)} className="text-zinc-600 transition hover:text-white"><ChevronRight size={16} /></button><button onClick={() => setMuted(!muted)} className="text-zinc-600 transition hover:text-white">{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div>}</div></div>
}

function Metric({ value, label }: { value: string; label: string }) { return <div className="rounded-xl border border-white/5 bg-white/[.025] p-4"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-zinc-500">{label}</p></div> }
function Activity({ text, time }: { text: string; time: string }) { return <div className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 text-zinc-300"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{text}</span><span className="text-zinc-600">{time}</span></div> }
function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold tracking-[.24em] text-primary">{eyebrow}</p><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 text-zinc-400">{text}</p></div> }

function HowStep({ number, icon, title, text, tags }: { number: string; icon: React.ReactNode; title: string; text: string; tags: string[] }) { return <article className="group relative flex h-full flex-col rounded-2xl border border-white/[.075] bg-[#0d121b] p-6 transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:bg-[#101621] hover:shadow-[0_22px_55px_rgba(0,0,0,.22)] sm:p-7"><div className="mb-7 flex items-center justify-between"><span className="grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/[.07] text-primary shadow-[0_10px_30px_rgba(124,92,252,.08)] transition duration-500 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">{icon}</span><span className="text-4xl font-extrabold tracking-[-.06em] text-white/[.045] transition group-hover:text-primary/15">{number}</span></div><div className="h-px bg-gradient-to-r from-white/[.08] to-transparent" /><h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-100">{title}</h3><p className="mt-3 min-h-[72px] text-sm leading-6 text-zinc-500">{text}</p><div className="mt-auto flex flex-wrap gap-2 pt-5">{tags.map((tag) => <span key={tag} className="flex items-center gap-1.5 rounded-lg border border-white/[.065] bg-white/[.025] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600 transition group-hover:border-primary/15 group-hover:text-zinc-400"><CheckCircle2 size={10} className="text-emerald-500/70" />{tag}</span>)}</div></article> }

function AuthPage({ mode, onNavigate, onNotice, notice, onLogin }: { mode: 'login' | 'register'; onNavigate: (view: View) => void; onNotice: (value: string) => void; notice: string; onLogin: (user: User) => void }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'register'
  const passwordStrength = Math.min(3, [password.length >= 6, /[A-Z]/.test(password), /\d|[^a-zA-Z]/.test(password)].filter(Boolean).length)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (name.trim().length < 3 || password.length < 6) return onNotice('Preencha um nome válido e uma senha de pelo menos 6 caracteres.')
    setLoading(true)
    if (isRegister) {
      const keyUpper = key.trim().toUpperCase()
      const days = keyUpper.startsWith('DIA') ? 1 : keyUpper.startsWith('SEM') ? 7 : keyUpper.startsWith('MEN') ? 30 : 0
      if (!days) {
        setLoading(false)
        return onNotice('A key deve começar com DIA, SEM ou MEN.')
      }
      const expiresAt = new Date(Date.now() + days * 86400000).toISOString()
      const { error } = await supabase.auth.signUp({
        email: accountEmail(name),
        password,
        options: { data: { name: name.trim(), access_key: keyUpper, expires_at: expiresAt } },
      })
      setLoading(false)
      if (error) return onNotice(error.message.includes('already registered') ? 'Este nome já está cadastrado.' : 'Não foi possível criar a conta.')
      await supabase.auth.signOut()
      onNavigate('login')
      onNotice('Cadastro realizado. Entre com seus dados.')
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: accountEmail(name), password })
    if (error || !data.user) {
      setLoading(false)
      return onNotice('Nome ou senha incorretos.')
    }
    const user = await loadProfile(data.user.id)
    setLoading(false)
    if (!user) return onNotice('Perfil não encontrado. Verifique a configuração do banco.')
    if (new Date(user.expiresAt).getTime() <= Date.now()) {
      await supabase.auth.signOut()
      return onNotice('Sua key expirou. Ative uma nova key para entrar.')
    }
    onLogin(user)
  }

  return <div className="relative grid min-h-screen overflow-hidden bg-[#070a10] text-zinc-100 lg:grid-cols-[1.08fr_.92fr]"><div className="auth-grid-motion pointer-events-none absolute inset-0 grid-bg opacity-50" /><div className="auth-blob pointer-events-none absolute -left-48 top-1/4 h-[560px] w-[560px] rounded-full bg-primary/10 blur-[140px]" /><div className="auth-blob auth-blob-delay pointer-events-none absolute -right-40 -top-40 h-[440px] w-[440px] rounded-full bg-indigo-500/[.08] blur-[130px]" /><div className="auth-blob pointer-events-none absolute bottom-[-240px] right-[20%] h-[480px] w-[480px] rounded-full bg-cyan-400/[.04] blur-[130px]" /><div className="relative hidden overflow-hidden border-r border-white/[.06] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16"><div className="absolute inset-0 bg-gradient-to-br from-primary/[.08] via-transparent to-cyan-400/[.03]" /><button onClick={() => onNavigate('home')} className="reveal-up relative flex w-fit items-center gap-3 font-bold"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/25"><Bot size={23} /></span><span>ADQUIRA<span className="text-primary">BOT</span></span></button><div className="relative max-w-xl"><div className="reveal-up reveal-delay-1 mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-violet-300"><Sparkles size={12} /> Automação inteligente</div><h2 className="reveal-up reveal-delay-2 text-5xl font-extrabold leading-[1.08] tracking-[-.045em] xl:text-6xl">Menos tarefas.<br /><span className="hero-word">Mais comunidade.</span></h2><p className="reveal-up reveal-delay-3 mt-6 max-w-lg text-lg leading-8 text-zinc-500">Acesse seu painel e mantenha filas, mensagens e jogadores funcionando em perfeita sintonia.</p><div className="reveal-up reveal-delay-3 mt-9 space-y-3"><AuthFeature icon={<UsersRound size={16} />} title="Filas sempre organizadas" text="Partidas em movimento sem esforço manual." /><AuthFeature icon={<MessageSquareText size={16} />} title="Mensagens no momento certo" text="Sua comunidade informada automaticamente." /><AuthFeature icon={<ShieldCheck size={16} />} title="Acesso seguro e persistente" text="Seus dados protegidos pelo Supabase." /></div></div><div className="relative flex items-center gap-3 text-xs text-zinc-700"><span className="h-px w-8 bg-white/10" /> Sua comunidade, sempre ativa.</div></div><div className="relative flex min-h-screen items-center justify-center p-5 sm:p-8"><div key={mode} className="reveal-up w-full max-w-[440px]"><div className="mb-7 flex items-center justify-between lg:hidden"><button onClick={() => onNavigate('home')} className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-600"><Bot size={20} /></span><span>ADQUIRA<span className="text-primary">BOT</span></span></button><span className="rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600">Acesso seguro</span></div><button onClick={() => onNavigate('home')} className="group mb-7 flex items-center gap-2 text-sm text-zinc-600 transition hover:text-white"><span className="grid h-8 w-8 place-items-center rounded-lg border border-white/[.07] bg-white/[.025] transition group-hover:border-white/15"><ArrowRight className="rotate-180" size={14} /></span> Voltar ao início</button><div className="auth-card relative overflow-hidden rounded-[28px] border border-white/[.09] bg-[#0c121d]/95 p-7 shadow-[0_35px_110px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:p-9"><div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" /><div className="mb-7 flex rounded-xl border border-white/[.06] bg-black/20 p-1"><button type="button" onClick={() => onNavigate('login')} className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition duration-300 ${!isRegister ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-600 hover:text-zinc-300'}`}>Entrar</button><button type="button" onClick={() => onNavigate('register')} className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition duration-300 ${isRegister ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-600 hover:text-zinc-300'}`}>Criar conta</button></div><span className="auth-icon-float grid h-12 w-12 place-items-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-indigo-500/5 text-violet-300 shadow-[0_10px_30px_rgba(124,92,252,.12)]">{isRegister ? <KeyRound /> : <LockKeyhole />}</span><h1 className="mt-5 text-[32px] font-extrabold tracking-[-.035em]">{isRegister ? 'Crie sua conta' : 'Que bom ter você de volta'}</h1><p className="mt-2 text-sm leading-6 text-zinc-600">{isRegister ? 'Crie seu acesso em poucos segundos.' : 'Entre para continuar gerenciando seu bot.'}</p>{notice && <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[.07] p-3 text-xs leading-5 text-amber-200"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />{notice}</div>}<form onSubmit={submit} className="mt-7 space-y-4"><Field label="Nome de usuário" value={name} onChange={setName} placeholder="Digite seu nome" /><div><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Senha</span><span className="relative block"><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" className="auth-field w-full rounded-xl border border-white/[.08] bg-[#080d15] px-4 py-3.5 pr-12 text-sm outline-none placeholder:text-zinc-800 focus:border-primary/60 focus:ring-4 focus:ring-primary/[.07]" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-700 transition hover:text-zinc-300">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{isRegister && password && <div className="mt-2 flex items-center gap-2"><div className="flex flex-1 gap-1">{[1, 2, 3].map((level) => <span key={level} className={`h-1 flex-1 rounded-full transition duration-500 ${passwordStrength >= level ? level === 1 ? 'bg-red-400' : level === 2 ? 'bg-amber-400' : 'bg-emerald-400' : 'bg-white/[.06]'}`} />)}</div><span className="text-[9px] font-semibold uppercase text-zinc-700">{passwordStrength === 1 ? 'Fraca' : passwordStrength === 2 ? 'Boa' : passwordStrength === 3 ? 'Forte' : 'Senha'}</span></div>}</div>{isRegister && <Field label="Key de acesso" value={key} onChange={(value) => setKey(value.toUpperCase())} placeholder="Ex: SEM-XXXX-XXXX" />}<button disabled={loading} className="shine group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 p-4 font-bold shadow-[0_12px_30px_rgba(124,92,252,.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(124,92,252,.3)] disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Conectando...</> : <>{isRegister ? 'Criar minha conta' : 'Entrar no painel'} <ArrowRight size={18} className="transition group-hover:translate-x-1" /></>}</button></form><div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-wider text-zinc-700"><span className="h-px flex-1 bg-white/[.06]" /><ShieldCheck size={13} /> Acesso protegido <span className="h-px flex-1 bg-white/[.06]" /></div></div></div></div></div>
}

function AuthFeature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="group flex items-center gap-4 rounded-2xl border border-white/[.06] bg-white/[.02] p-4 transition duration-500 hover:translate-x-2 hover:border-primary/20 hover:bg-primary/[.04] hover:shadow-[0_12px_35px_rgba(0,0,0,.12)]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[.06] bg-white/[.035] text-violet-300 transition duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/20 group-hover:bg-primary/10">{icon}</span><div><p className="text-sm font-bold text-zinc-200">{title}</p><p className="mt-1 text-xs text-zinc-600">{text}</p></div></div> }

function Field({ label, value, onChange, placeholder, password }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; password?: boolean }) { return <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span><input required type={password ? 'password' : 'text'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="auth-field w-full rounded-xl border border-white/[.08] bg-[#080d15] px-4 py-3.5 text-sm outline-none placeholder:text-zinc-800 focus:border-primary/60 focus:ring-4 focus:ring-primary/[.07]" /></label> }

type BotSettings = {
  bot_token: string
  queue_types: string
  queue_message: string
  mention_players: boolean
  reply_dm: boolean
  rich_presence: boolean
  bot_status: string
  presence_type: string
  presence_text: string
  presence_status: string
}

const initialBotSettings: BotSettings = {
  bot_token: '',
  queue_types: '1x1, 2x2, 3x3',
  queue_message: 'Entre na fila e aguarde sua vez!',
  mention_players: true,
  reply_dm: false,
  rich_presence: true,
  bot_status: 'stopped',
  presence_type: 'Jogando',
  presence_text: 'Free Fire',
  presence_status: 'online',
}

function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [section, setSection] = useState('Visão geral')
  const [settings, setSettings] = useState(initialBotSettings)
  const [saved, setSaved] = useState('')
  const [running, setRunning] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const active = new Date(user.expiresAt).getTime() > Date.now()
  const firstName = user.name.split(' ')[0]
  const completion = [settings.bot_token, settings.queue_types, settings.queue_message].filter(Boolean).length
  const setupProgress = Math.round((completion / 3) * 100)

  useEffect(() => {
    supabase.from('profiles').select('bot_token, queue_types, queue_message, mention_players, reply_dm, rich_presence, bot_status, presence_type, presence_text, presence_status').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setSettings(data as BotSettings)
        setRunning(data.bot_status === 'running')
      }
    })
  }, [user.id])

  const updateSetting = <K extends keyof BotSettings>(key: K, value: BotSettings[K]) => setSettings((current) => ({ ...current, [key]: value }))
  const queueOptions = ['1x1', '2x2', '3x3', '4x4', '6x6']
  const selectedQueues = settings.queue_types.split(',').map((item) => item.trim()).filter(Boolean)
  const toggleQueue = (queue: string) => {
    const next = selectedQueues.includes(queue) ? selectedQueues.filter((item) => item !== queue) : [...selectedQueues, queue]
    updateSetting('queue_types', next.join(', '))
  }

  const saveSettings = async () => {
    setSaved('Salvando...')
    const { error } = await supabase.from('profiles').update(settings).eq('id', user.id)
    setSaved(error ? 'Não foi possível salvar.' : 'Configurações salvas.')
    window.setTimeout(() => setSaved(''), 2500)
  }

  const changeStatus = async (next: boolean) => {
    setRunning(next)
    const bot_status = next ? 'running' : 'stopped'
    setSettings((current) => ({ ...current, bot_status }))
    await supabase.from('profiles').update({ bot_status }).eq('id', user.id)
  }

  const navItems = [
    { name: 'Visão geral', icon: LayoutDashboard },
    { name: 'Meu bot', icon: Bot },
    { name: 'Filas', icon: UsersRound },
    { name: 'Servidores', icon: Server },
  ]

  return (
    <div className="min-h-screen bg-[#070a10] text-zinc-100 selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -left-60 -top-60 h-[620px] w-[620px] rounded-full bg-primary/[.08] blur-[140px]" /><div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan-500/[.035] blur-[140px]" /></div>
      {mobileMenu && <button onClick={() => setMobileMenu(false)} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" aria-label="Fechar menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[278px] flex-col border-r border-white/[.07] bg-[#0b1019]/95 p-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2 py-2"><div className="flex items-center gap-3"><span className="relative grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25"><Bot size={23} /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0b1019] bg-emerald-400" /></span><div><p className="font-extrabold tracking-tight">ADQUIRA BOT</p><p className="text-[9px] font-semibold uppercase tracking-[.22em] text-zinc-600">Control center</p></div></div><button onClick={() => setMobileMenu(false)} className="text-zinc-600 lg:hidden"><X size={19} /></button></div>
        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-zinc-700">Workspace</p>
        <nav className="space-y-1.5">{navItems.map(({ name, icon: Icon }) => <button key={name} onClick={() => { setSection(name); setMobileMenu(false) }} className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${section === name ? 'bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:bg-white/[.045] hover:text-zinc-200'}`}><Icon size={18} /><span className="flex-1 text-left">{name}</span><ChevronRight size={14} className={`transition ${section === name ? 'opacity-70' : 'translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-50'}`} /></button>)}</nav>
        <div className="mt-auto overflow-hidden rounded-2xl border border-white/[.08] bg-gradient-to-br from-white/[.045] to-transparent p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.15em] text-zinc-500">Status do bot</span><span className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase ${running ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/5 text-zinc-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${running ? 'bg-emerald-400 shadow-[0_0_9px_#34d399]' : 'bg-zinc-600'}`} />{running ? 'Online' : 'Offline'}</span></div><div className="mt-4 flex items-end justify-between"><div><p className="text-sm font-bold">{running ? 'Tudo funcionando' : 'Bot em espera'}</p><p className="mt-1 text-[11px] text-zinc-600">{running ? 'Automação em execução' : 'Clique em iniciar para operar'}</p></div><ActivityIcon size={20} className={running ? 'text-emerald-400' : 'text-zinc-700'} /></div></div>
        <button onClick={onLogout} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-red-500/20 py-3 text-sm text-red-400 transition hover:bg-red-500/10"><LogOut size={16} /> Sair da conta</button>
      </aside>

      <div className="relative lg:pl-[278px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[.06] bg-[#070a10]/80 px-5 backdrop-blur-2xl sm:px-8"><div className="flex items-center gap-4"><button onClick={() => setMobileMenu(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/[.08] bg-white/[.03] text-zinc-400 lg:hidden"><Menu size={19} /></button><div><div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-zinc-700"><span>Painel</span><ChevronRight size={11} /><span className="text-zinc-500">{section}</span></div><h1 className="mt-1 flex items-center gap-2 text-lg font-bold sm:text-xl">Olá, {firstName}{user.role === 'admin' && <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-violet-300">ADMIN</span>}</h1></div></div><div className="flex items-center gap-2"><span className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold sm:flex ${running ? 'border-emerald-400/15 bg-emerald-400/[.07] text-emerald-300' : 'border-white/[.07] bg-white/[.02] text-zinc-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${running ? 'bg-emerald-400' : 'bg-zinc-700'}`} />{running ? 'Sistema operacional' : 'Sistema pausado'}</span><button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[.07] bg-white/[.025] text-zinc-500 transition hover:text-zinc-200"><Bell size={17} /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" /></button></div></header>

        <main className="relative mx-auto max-w-[1520px] p-5 sm:p-8">
          <section className="mb-7 flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-white/[.07] bg-gradient-to-r from-[#111727] via-[#101522] to-primary/[.12] p-6 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:p-7"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-violet-300"><Sparkles size={12} /> Central de automação</div><h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Sua comunidade no controle.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Configure, acompanhe e gerencie toda a operação do seu bot em um único lugar.</p></div><div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/[.07] bg-black/15 p-4"><div className="relative grid h-14 w-14 place-items-center"><svg className="absolute h-14 w-14 -rotate-90"><circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" /><circle cx="28" cy="28" r="24" fill="none" stroke="#7c5cfc" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${setupProgress * 1.508} 151`} /></svg><span className="text-xs font-bold">{setupProgress}%</span></div><div><p className="text-sm font-bold">Configuração</p><p className="mt-1 text-xs text-zinc-600">{setupProgress === 100 ? 'Tudo pronto para iniciar' : 'Complete os dados do bot'}</p></div></div></section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard icon={<ShieldCheck size={20} />} label="Licença" value={active ? 'Ativa' : 'Expirada'} detail={formatRemaining(user.expiresAt)} accent />
            <DashboardCard icon={<ActivityIcon size={20} />} label="Status do bot" value={running ? 'Online' : 'Offline'} detail={running ? 'Operando normalmente' : 'Pronto para iniciar'} />
            <DashboardCard icon={<UsersRound size={20} />} label="Entradas nas filas" value="0" detail="Nenhuma entrada hoje" />
            <DashboardCard icon={<Zap size={20} />} label="Mensagens enviadas" value="0" detail="Aguardando atividade" />
          </div>

          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.35fr_.65fr]">
            <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#0d131e]">
              <div className="flex items-center justify-between border-b border-white/[.07] px-6 py-5"><div><h2 className="font-bold">Configuração do bot</h2><p className="mt-1 text-xs text-zinc-600">Personalize como sua automação deve funcionar.</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Settings2 size={20} /></span></div>
              <div className="space-y-5 p-6">
                <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Token da conta</span><span className="relative block"><input type={showToken ? 'text' : 'password'} value={settings.bot_token} onChange={(event) => updateSetting('bot_token', event.target.value)} placeholder="Cole o token de acesso" className="w-full rounded-xl border border-white/[.08] bg-[#080d15] px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-zinc-700 focus:border-primary/60 focus:ring-4 focus:ring-primary/[.07]" /><button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-600 transition hover:text-zinc-300">{showToken ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
                <div><div className="mb-3 flex items-end justify-between"><div><span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Tipos de fila</span><p className="mt-1 text-[11px] text-zinc-700">Selecione todos os modos disponíveis para sua comunidade.</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-violet-300">{selectedQueues.length} ativos</span></div><div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">{queueOptions.map((queue) => { const selected = selectedQueues.includes(queue); return <button type="button" key={queue} onClick={() => toggleQueue(queue)} className={`relative overflow-hidden rounded-xl border p-3 text-left transition ${selected ? 'border-primary/35 bg-primary/[.09] text-white shadow-[0_0_20px_rgba(124,92,252,.08)]' : 'border-white/[.07] bg-[#080d15] text-zinc-600 hover:border-white/[.13] hover:text-zinc-300'}`}><span className={`mb-3 grid h-8 w-8 place-items-center rounded-lg text-xs font-extrabold ${selected ? 'bg-primary text-white' : 'bg-white/[.04]'}`}>{queue.split('x')[0]}</span><span className="block text-sm font-bold">{queue}</span><span className="mt-0.5 block text-[9px] uppercase tracking-wider opacity-50">Modo de jogo</span>{selected && <CheckCircle2 size={14} className="absolute right-2.5 top-2.5 text-primary" />}</button> })}</div></div>
                <div className="rounded-2xl border border-white/[.07] bg-gradient-to-br from-[#0a101a] to-[#0c121d] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><div><span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Presença do bot</span><p className="mt-1 text-[11px] text-zinc-700">Defina como o bot aparecerá para os jogadores.</p></div><div className="flex items-center gap-2 rounded-full border border-white/[.07] bg-black/20 px-3 py-1.5 text-[10px] text-zinc-500"><span className={`h-2 w-2 rounded-full ${settings.presence_status === 'online' ? 'bg-emerald-400' : settings.presence_status === 'idle' ? 'bg-amber-400' : settings.presence_status === 'dnd' ? 'bg-red-400' : 'bg-zinc-500'}`} />Prévia</div></div><div className="grid gap-3 sm:grid-cols-[.8fr_1.35fr_.8fr]"><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-600">Atividade</span><select value={settings.presence_type} onChange={(event) => updateSetting('presence_type', event.target.value)} className="w-full rounded-xl border border-white/[.08] bg-[#070c14] px-3 py-3 text-sm outline-none focus:border-primary/60"><option>Jogando</option><option>Assistindo</option><option>Ouvindo</option><option>Competindo</option></select></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-600">Texto exibido</span><input value={settings.presence_text} maxLength={60} onChange={(event) => updateSetting('presence_text', event.target.value)} placeholder="Ex: Free Fire" className="w-full rounded-xl border border-white/[.08] bg-[#070c14] px-3 py-3 text-sm outline-none placeholder:text-zinc-800 focus:border-primary/60" /><span className="mt-1 block text-right text-[9px] text-zinc-700">{settings.presence_text.length}/60</span></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-600">Status</span><select value={settings.presence_status} onChange={(event) => updateSetting('presence_status', event.target.value)} className="w-full rounded-xl border border-white/[.08] bg-[#070c14] px-3 py-3 text-sm outline-none focus:border-primary/60"><option value="online">Online</option><option value="idle">Ausente</option><option value="dnd">Não perturbe</option><option value="invisible">Invisível</option></select></label></div><div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.025] p-3"><span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-indigo-600"><Bot size={19} /><span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0b111b] ${settings.presence_status === 'online' ? 'bg-emerald-400' : settings.presence_status === 'idle' ? 'bg-amber-400' : settings.presence_status === 'dnd' ? 'bg-red-400' : 'bg-zinc-500'}`} /></span><div><p className="text-sm font-bold">Adquira Bot</p><p className="mt-0.5 text-xs text-zinc-600">{settings.presence_type} {settings.presence_text || 'sua comunidade'}</p></div></div></div>
                <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Mensagem da fila</span><textarea value={settings.queue_message} onChange={(event) => updateSetting('queue_message', event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-white/[.08] bg-[#080d15] px-4 py-3 text-sm outline-none focus:border-primary/60" /></label>
                <div className="space-y-3"><SettingToggle title="Mencionar jogadores" text="Marca o adversário e os participantes após cada entrada." enabled={settings.mention_players} onChange={(value) => updateSetting('mention_players', value)} /><SettingToggle title="Responder mensagens privadas" text="Responde automaticamente às mensagens recebidas." enabled={settings.reply_dm} onChange={(value) => updateSetting('reply_dm', value)} /><SettingToggle title="Rich Presence" text="Exibe o status do bot no perfil da conta." enabled={settings.rich_presence} onChange={(value) => updateSetting('rich_presence', value)} /></div>
                <div className="flex flex-wrap items-center gap-3 border-t border-white/[.07] pt-5"><button onClick={saveSettings} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold transition hover:bg-violet-500"><Save size={17} /> Salvar alterações</button>{!running ? <button onClick={() => changeStatus(true)} className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/25"><Play size={17} /> Iniciar bot</button> : <button onClick={() => changeStatus(false)} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20"><Square size={15} /> Parar bot</button>}<span className="text-xs text-emerald-400">{saved}</span></div>
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-2xl border border-white/[.08] bg-[#0d131e] p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Sua licença</p><h2 className="mt-2 text-xl font-bold">Acesso {active ? 'ativo' : 'expirado'}</h2></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400"><KeyRound size={21} /></span></div><div className="mt-5 rounded-xl border border-emerald-400/15 bg-emerald-400/[.06] p-4"><div className="flex justify-between gap-3 text-sm"><span className="text-zinc-500">Tempo restante</span><span className="font-semibold text-emerald-300">{formatRemaining(user.expiresAt)}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" /></div></div><p className="mt-4 truncate font-mono text-[11px] text-zinc-700">{user.key}</p></section>
              <section className="rounded-2xl border border-white/[.08] bg-[#0d131e] p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Atividade recente</h2><p className="mt-1 text-xs text-zinc-600">Eventos do bot em tempo real.</p></div><Gauge size={20} className="text-zinc-600" /></div><div className="mt-6 rounded-xl border border-dashed border-white/[.08] py-10 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white/[.03] text-zinc-700"><Gamepad2 size={20} /></span><p className="mt-3 text-sm font-medium text-zinc-500">Nenhuma atividade ainda</p><p className="mt-1 text-xs text-zinc-700">Os eventos aparecerão ao iniciar o bot.</p></div></section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SettingToggle({ title, text, enabled, onChange }: { title: string; text: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!enabled)} className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${enabled ? 'border-primary/15 bg-primary/[.045]' : 'border-white/[.07] bg-[#090e17] hover:border-white/[.11]'}`}><span><span className="flex items-center gap-2 text-sm font-semibold">{title}{enabled && <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400">Ativo</span>}</span><span className="mt-1 block text-xs text-zinc-600">{text}</span></span><span className={`relative h-6 w-11 shrink-0 rounded-full transition duration-300 ${enabled ? 'bg-primary shadow-[0_0_18px_rgba(124,92,252,.25)]' : 'bg-zinc-800'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${enabled ? 'left-6' : 'left-1'}`} /></span></button>
}

function DashboardCard({ icon, label, value, detail, accent }: { icon: React.ReactNode; label: string; value: string; detail: string; accent?: boolean }) {
  return <div className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[.13] ${accent ? 'border-primary/20 bg-gradient-to-br from-primary/[.13] via-[#111725] to-[#0d131e]' : 'border-white/[.07] bg-gradient-to-br from-[#101722] to-[#0c111a]'}`}><div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition group-hover:scale-125 ${accent ? 'bg-primary/15' : 'bg-white/[.025]'}`} /><div className="relative flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent ? 'border-primary/15 bg-primary/15 text-violet-300' : 'border-white/[.06] bg-white/[.035] text-zinc-500'}`}>{icon}</span><span className="text-[9px] font-bold uppercase tracking-[.16em] text-zinc-700">{label}</span></div><p className="relative mt-5 text-2xl font-extrabold tracking-tight">{value}</p><div className="relative mt-1 flex items-center gap-1.5"><span className={`h-1 w-1 rounded-full ${accent ? 'bg-primary' : 'bg-zinc-700'}`} /><p className="text-[11px] text-zinc-600">{detail}</p></div></div>
}

export default App
