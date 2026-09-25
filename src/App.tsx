import { useEffect, useMemo, useState } from 'react'
import { WhopElements } from '@whop/elements-react'
import { loadWhop } from '@whop/elements'
import { consumeOAuthCallback, logoutWhop, readSession, type WhopSession } from './auth'
import { appearanceFor } from './appearance'
import { Shell } from './components/Shell'
import { fetchAccountTitle, getElementToken } from './elementToken'
import { readStoredTheme, storeTheme, type ThemeId } from './theme'
import { AdsPage } from './pages/AdsPage'
import { LoginPage } from './pages/LoginPage'
import { PaymentsPage } from './pages/PaymentsPage'

const App = () => {
  const elements = useMemo(() => loadWhop(), [])
  const [session, setSession] = useState<WhopSession | null>(() =>
    window.location.pathname === '/oauth/callback' ? null : readSession(),
  )
  const [path, setPath] = useState(() => {
    const current = window.location.pathname
    if (current === '/ads' || current === '/payments') return current
    if (current !== '/oauth/callback' && readSession()) {
      window.history.replaceState({}, '', '/ads')
      return '/ads'
    }
    return current === '/oauth/callback' ? '/ads' : current
  })
  const [authError, setAuthError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(window.location.pathname === '/oauth/callback')
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [accountTitle, setAccountTitle] = useState('Whop account')
  const [theme, setTheme] = useState<ThemeId>(readStoredTheme)
  const appearance = useMemo(() => appearanceFor(theme), [theme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    storeTheme(theme)
  }, [theme])

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  useEffect(() => {
    if (window.location.pathname !== '/oauth/callback') return
    void consumeOAuthCallback()
      .then((next) => {
        setSession(next)
        window.history.replaceState({}, '', '/ads')
        setPath('/ads')
      })
      .catch((error: unknown) => {
        setAuthError(error instanceof Error ? error.message : 'Sign-in failed.')
        window.history.replaceState({}, '', '/')
        setPath('/')
      })
      .finally(() => setSigningIn(false))
  }, [])

  useEffect(() => {
    if (!session) return
    let cancelled = false
    void getElementToken()
      .then((token) => {
        if (!cancelled) setAccessToken(token)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setTokenError(error instanceof Error ? error.message : 'Could not open Whop.')
        }
      })
    void fetchAccountTitle()
      .then((title) => {
        if (!cancelled) setAccountTitle(title)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [session])

  const handleNavigate = (next: string) => {
    window.history.pushState({}, '', next)
    setPath(next)
  }

  const handleLogout = () => {
    void logoutWhop().finally(() => {
      setSession(null)
      setAccessToken(null)
      window.history.pushState({}, '', '/')
      setPath('/')
    })
  }

  if (signingIn) {
    return (
      <main className="login">
        <p className="eyebrow">ROAS Labs</p>
        <h1>Signing you in</h1>
      </main>
    )
  }

  if (!session) {
    return <LoginPage error={authError} />
  }

  const page = path === '/payments' ? 'payments' : 'ads'

  return (
    <WhopElements elements={elements} appearance={appearance}>
      <Shell
        path={page === 'payments' ? '/payments' : '/ads'}
        user={session.user}
        accountTitle={accountTitle}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        theme={theme}
        onThemeChange={setTheme}
      >
        {tokenError ? <p className="banner warning page-error">{tokenError}</p> : null}
        {!accessToken && !tokenError ? <p className="hint page-error">Opening Whop…</p> : null}
        {accessToken && page === 'ads' ? <AdsPage accessToken={accessToken} /> : null}
        {accessToken && page === 'payments' ? <PaymentsPage accessToken={accessToken} /> : null}
      </Shell>
    </WhopElements>
  )
}

export default App
