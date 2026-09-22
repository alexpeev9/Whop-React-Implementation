import { useState } from 'react'
import { configError } from '../config'
import { startWhopLogin } from '../auth'

type LoginPageProps = {
  error: string | null
}

export const LoginPage = ({ error }: LoginPageProps) => {
  const [pending, setPending] = useState(false)
  const blocked = configError()

  const handleSignIn = () => {
    if (blocked || pending) return
    setPending(true)
    void startWhopLogin().catch(() => setPending(false))
  }

  return (
    <main className="login">
      <p className="eyebrow">ROAS Labs</p>
      <h1>Client portal</h1>
      <p className="lede">
        Sign in with Whop to open ROAS Ads and ROAS Payments. Both tools run here, on the Roaslabs
        account, instead of in Facebook Business Manager or Shopify.
      </p>
      {blocked ? <p className="banner warning">{blocked}</p> : null}
      {error ? <p className="banner warning">{error}</p> : null}
      <button
        type="button"
        className="primary"
        onClick={handleSignIn}
        disabled={Boolean(blocked) || pending}
        aria-label="Sign in with Whop"
      >
        {pending ? 'Redirecting to Whop…' : 'Sign in with Whop'}
      </button>
    </main>
  )
}
