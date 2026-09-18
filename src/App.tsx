import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Bot, CheckCircle2, Clock3, KeyRound, LockKeyhole, LogOut, Menu, MessageSquareText, ShieldCheck, Sparkles, UsersRound, X } from 'lucide-react'

type View = 'home' | 'login' | 'register' | 'dashboard'
type User = { name: string; password: string; key: string; expiresAt: string }

const USERS_KEY = 'adquira-bot-users'
const SESSION_KEY = 'adquira-bot-session'

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

function loadUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
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
    const name = localStorage.getItem(SESSION_KEY)
    if (name) setSession(loadUsers().find((user) => user.name === name) || null)
  }, [])

  const navigate = (next: View) => {
    setNotice('')
    setMenuOpen(false)
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
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
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-[0_0_24px_rgba(124,92,252,.35)]"><Bot size={22} /></span>
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
        <section className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-20 pt-32 lg:px-8">
          <div className="glow absolute -right-52 top-24 h-[700px] w-[700px]" />
          <div className="relative z-10 grid w-full items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-violet-300"><Sparkles size={14} /> SUA COMUNIDADE NO AUTOMÁTICO</div>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-.045em] sm:text-6xl lg:text-7xl">Divulgue sua organização. <span className="text-primary">Alcance muito mais.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">Automatize entradas em filas, envio de mensagens e marcação de jogadores. Uma solução prática para movimentar sua comunidade sem perder tempo.</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => navigate('register')} className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 font-bold shadow-[0_12px_35px_rgba(124,92,252,.28)] transition hover:-translate-y-1 hover:bg-violet-500">Começar agora <ArrowRight size={19} className="transition group-hover:translate-x-1" /></button>
                <a href="#recursos" className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-center font-semibold transition hover:bg-white/10">Conhecer recursos</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500"><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Ativação rápida</span><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Fácil de usar</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="float relative rounded-3xl border border-white/10 bg-panel/90 p-3 shadow-2xl shadow-primary/10 backdrop-blur">
                <div className="rounded-2xl border border-white/5 bg-[#0b0e14] p-6">
                  <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary"><Bot size={22} /></span><div><p className="font-bold">Adquira Bot</p><p className="text-xs text-emerald-400">● Online agora</p></div></div><span className="rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-500">PAINEL</span></div>
                  <div className="grid grid-cols-2 gap-3"><Metric value="1.284" label="Membros alcançados" /><Metric value="96%" label="Taxa de entrega" /></div>
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[.025] p-4"><div className="mb-4 flex justify-between text-sm"><span>Fila da comunidade</span><span className="text-primary">18/20</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full w-[90%] rounded-full bg-primary" /></div><div className="mt-5 space-y-3"><Activity text="12 jogadores foram marcados" time="agora" /><Activity text="Mensagem enviada com sucesso" time="2 min" /><Activity text="Nova entrada na fila" time="4 min" /></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="border-y border-white/5 bg-white/[.015] py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="RECURSOS" title="Tudo para sua comunidade crescer" text="Automação simples, eficiente e feita para você ganhar tempo." /><div className="mt-14 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="group rounded-2xl border border-white/10 bg-panel p-7 transition hover:-translate-y-1 hover:border-primary/40"><span className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white"><Icon /></span><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{text}</p></div>)}</div></div>
        </section>

        <section id="como-funciona" className="py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="SEM COMPLICAÇÃO" title="Pronto em poucos minutos" text="Crie sua conta, ative sua key e comece a automatizar." /><div className="mt-14 grid gap-6 md:grid-cols-3">{['Crie sua conta', 'Ative sua key', 'Configure seu bot'].map((item, index) => <div key={item} className="relative rounded-2xl border border-white/10 p-7"><span className="text-5xl font-extrabold text-white/5">0{index + 1}</span><h3 className="mt-5 text-xl font-bold">{item}</h3><p className="mt-3 text-zinc-400">{index === 0 ? 'Cadastre seu nome e uma senha segura.' : index === 1 ? 'Use sua key diária, semanal ou mensal.' : 'Personalize as ações para sua comunidade.'}</p></div>)}</div></div></section>

        <section id="planos" className="border-y border-white/5 bg-white/[.015] py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="PLANOS" title="Escolha seu tempo de acesso" text="Opções flexíveis para cada fase da sua comunidade." /><div className="mt-14 grid items-center gap-5 md:grid-cols-3">{plans.map((plan) => <div key={plan.name} className={`relative rounded-2xl border p-7 ${plan.popular ? 'border-primary bg-primary/[.07] shadow-xl shadow-primary/10 md:-translate-y-3' : 'border-white/10 bg-panel'}`}>{plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold">MAIS ESCOLHIDO</span>}<h3 className="text-xl font-bold">{plan.name}</h3><p className="mt-2 text-sm text-zinc-500">{plan.period}</p><p className="mt-6 text-3xl font-extrabold">{plan.price}</p><p className="mt-4 text-zinc-400">{plan.detail}</p><button onClick={() => navigate('register')} className={`mt-7 w-full rounded-xl p-3 font-bold transition ${plan.popular ? 'bg-primary hover:bg-violet-500' : 'bg-white/5 hover:bg-white/10'}`}>Começar agora</button></div>)}</div></div></section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-10 text-sm text-zinc-500 sm:flex-row lg:px-8"><div className="flex items-center gap-2 font-bold text-zinc-300"><Bot size={18} className="text-primary" /> ADQUIRABOT</div><p>© 2026 Adquira Bot. Todos os direitos reservados.</p></footer>
    </div>
  )
}

function Metric({ value, label }: { value: string; label: string }) { return <div className="rounded-xl border border-white/5 bg-white/[.025] p-4"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-zinc-500">{label}</p></div> }
function Activity({ text, time }: { text: string; time: string }) { return <div className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 text-zinc-300"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{text}</span><span className="text-zinc-600">{time}</span></div> }
function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold tracking-[.24em] text-primary">{eyebrow}</p><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 text-zinc-400">{text}</p></div> }

function AuthPage({ mode, onNavigate, onNotice, notice, onLogin }: { mode: 'login' | 'register'; onNavigate: (view: View) => void; onNotice: (value: string) => void; notice: string; onLogin: (user: User) => void }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [key, setKey] = useState('')
  const isRegister = mode === 'register'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const users = loadUsers()
    if (isRegister) {
      if (name.trim().length < 3 || password.length < 6 || key.trim().length < 5) return onNotice('Preencha nome, senha de 6 caracteres e uma key válida.')
      if (users.some((user) => user.name.toLowerCase() === name.trim().toLowerCase())) return onNotice('Este nome já está cadastrado.')
      const keyUpper = key.trim().toUpperCase()
      const days = keyUpper.startsWith('DIA') ? 1 : keyUpper.startsWith('SEM') ? 7 : keyUpper.startsWith('MEN') ? 30 : 0
      if (!days) return onNotice('A key deve começar com DIA, SEM ou MEN.')
      const user = { name: name.trim(), password, key: keyUpper, expiresAt: new Date(Date.now() + days * 86400000).toISOString() }
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
      onNavigate('login')
      onNotice('Cadastro realizado. Entre com seus dados.')
      return
    }
    const user = users.find((item) => item.name.toLowerCase() === name.trim().toLowerCase() && item.password === password)
    if (!user) return onNotice('Nome ou senha incorretos.')
    if (new Date(user.expiresAt).getTime() <= Date.now()) return onNotice('Sua key expirou. Ative uma nova key para entrar.')
    localStorage.setItem(SESSION_KEY, user.name)
    onLogin(user)
  }

  return <div className="grid min-h-screen bg-ink text-zinc-100 grid-bg lg:grid-cols-2"><div className="hidden border-r border-white/5 lg:flex lg:flex-col lg:justify-between lg:p-12"><button onClick={() => onNavigate('home')} className="flex w-fit items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary"><Bot size={22} /></span> ADQUIRA<span className="-ml-3 text-primary">BOT</span></button><div className="max-w-lg"><p className="text-sm font-bold tracking-[.2em] text-primary">CRESÇA NO AUTOMÁTICO</p><h2 className="mt-5 text-5xl font-extrabold leading-tight">Mais alcance. Menos trabalho manual.</h2><p className="mt-6 text-lg leading-8 text-zinc-400">Entre para gerenciar sua automação e movimentar sua comunidade todos os dias.</p></div><p className="text-sm text-zinc-600">Sua comunidade, sempre ativa.</p></div><div className="flex items-center justify-center p-5"><div className="w-full max-w-md"><button onClick={() => onNavigate('home')} className="mb-10 flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowRight className="rotate-180" size={16} /> Voltar ao início</button><div className="rounded-3xl border border-white/10 bg-panel/90 p-7 shadow-2xl sm:p-9"><span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">{isRegister ? <KeyRound /> : <LockKeyhole />}</span><h1 className="mt-6 text-3xl font-extrabold">{isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1><p className="mt-2 text-sm text-zinc-500">{isRegister ? 'Cadastre seus dados e ative seu acesso.' : 'Entre para acessar seu painel.'}</p>{notice && <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{notice}</div>}<form onSubmit={submit} className="mt-7 space-y-5"><Field label="Nome" value={name} onChange={setName} placeholder="Seu nome de usuário" /><Field label="Senha" value={password} onChange={setPassword} placeholder="Mínimo de 6 caracteres" password />{isRegister && <Field label="Key de acesso" value={key} onChange={setKey} placeholder="Ex: SEM-XXXX-XXXX" />}<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-4 font-bold transition hover:bg-violet-500">{isRegister ? 'Criar conta' : 'Entrar no painel'} <ArrowRight size={18} /></button></form><p className="mt-6 text-center text-sm text-zinc-500">{isRegister ? 'Já possui uma conta?' : 'Ainda não tem uma conta?'} <button onClick={() => onNavigate(isRegister ? 'login' : 'register')} className="font-bold text-primary hover:text-violet-400">{isRegister ? 'Entrar' : 'Cadastre-se'}</button></p></div></div></div></div>
}

function Field({ label, value, onChange, placeholder, password }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; password?: boolean }) { return <label className="block"><span className="mb-2 block text-sm font-semibold text-zinc-300">{label}</span><input required type={password ? 'password' : 'text'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none transition placeholder:text-zinc-700 focus:border-primary/70 focus:ring-2 focus:ring-primary/10" /></label> }

function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const active = new Date(user.expiresAt).getTime() > Date.now()
  return <div className="min-h-screen bg-ink text-zinc-100 grid-bg"><header className="border-b border-white/5 bg-panel/70"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5"><div className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary"><Bot size={22} /></span> ADQUIRA<span className="-ml-3 text-primary">BOT</span></div><button onClick={onLogout} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"><LogOut size={16} /> Sair</button></div></header><main className="mx-auto max-w-6xl px-5 py-12"><p className="text-zinc-500">Visão geral</p><h1 className="mt-2 text-3xl font-extrabold">Olá, {user.name}.</h1><div className="mt-10 grid gap-5 md:grid-cols-3"><DashboardCard icon={<ShieldCheck />} label="Status do acesso" value={active ? 'Ativo' : 'Expirado'} accent /><DashboardCard icon={<Clock3 />} label="Tempo da key" value={formatRemaining(user.expiresAt)} /><DashboardCard icon={<KeyRound />} label="Sua key" value={user.key} /></div><div className="mt-6 rounded-2xl border border-white/10 bg-panel p-7"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><Bot /></span><div><h2 className="font-bold">Configuração do bot</h2><p className="text-sm text-zinc-500">A área de automações será conectada aqui.</p></div></div><div className="mt-7 rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-600">Seu painel está pronto para receber as configurações do bot.</div></div></main></div>
}

function DashboardCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) { return <div className={`rounded-2xl border p-6 ${accent ? 'border-primary/30 bg-primary/[.08]' : 'border-white/10 bg-panel'}`}><span className={accent ? 'text-primary' : 'text-zinc-500'}>{icon}</span><p className="mt-5 text-sm text-zinc-500">{label}</p><p className="mt-2 truncate text-xl font-bold">{value}</p></div> }

export default App
