import { oauthRedirectUri, whopAccountId, whopApiOrigin, whopAppId } from './config'

const SESSION_KEY = 'roas.whop.session'
const PKCE_KEY = 'roas.whop.pkce'

export type WhopUser = {
  sub: string
  name?: string
  username?: string
  email?: string
  picture?: string
}

export type WhopSession = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  obtainedAt: number
  companyId: string
  user: WhopUser
}

type PkceState = {
  codeVerifier: string
  state: string
  nonce: string
}

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

const base64url = (bytes: Uint8Array): string => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

const randomString = (length: number): string =>
  base64url(crypto.getRandomValues(new Uint8Array(length)))

const sha256 = async (value: string): Promise<string> =>
  base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))))

export const readSession = (): WhopSession | null => {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WhopSession
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

const writeSession = (session: WhopSession) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const userLabel = (user: WhopUser): string =>
  user.name || user.username || user.email || 'Whop user'

export const startWhopLogin = async (): Promise<void> => {
  const pkce: PkceState = {
    codeVerifier: randomString(32),
    state: randomString(16),
    nonce: randomString(16),
  }
  sessionStorage.setItem(PKCE_KEY, JSON.stringify(pkce))

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: whopAppId,
    redirect_uri: oauthRedirectUri,
    scope: 'openid profile email',
    state: pkce.state,
    nonce: pkce.nonce,
    code_challenge: await sha256(pkce.codeVerifier),
    code_challenge_method: 'S256',
    company_id: whopAccountId,
  })

  window.location.assign(`${whopApiOrigin}/oauth/authorize?${params}`)
}

const exchangeCode = async (code: string, codeVerifier: string): Promise<TokenResponse> => {
  const response = await fetch(`${whopApiOrigin}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: oauthRedirectUri,
      client_id: whopAppId,
      code_verifier: codeVerifier,
    }),
  })

  const body = (await response.json().catch(() => ({}))) as {
    error_description?: string
    error?: string
  } & Partial<TokenResponse>

  if (!response.ok || !body.access_token || !body.refresh_token) {
    throw new Error(body.error_description || body.error || 'Whop did not return a login token.')
  }

  return body as TokenResponse
}

const fetchUser = async (accessToken: string): Promise<WhopUser> => {
  const response = await fetch(`${whopApiOrigin}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) return { sub: 'signed-in' }

  const body = (await response.json()) as {
    sub?: string
    name?: string
    preferred_username?: string
    email?: string
    picture?: string
  }

  return {
    sub: body.sub || 'signed-in',
    name: body.name,
    username: body.preferred_username,
    email: body.email,
    picture: body.picture,
  }
}

let callbackInflight: Promise<WhopSession> | null = null

export const consumeOAuthCallback = (): Promise<WhopSession> => {
  if (callbackInflight) return callbackInflight

  callbackInflight = (async () => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    if (error) {
      throw new Error(params.get('error_description') || error)
    }

    const code = params.get('code')
    const returnedState = params.get('state')
    const stored = JSON.parse(sessionStorage.getItem(PKCE_KEY) || 'null') as PkceState | null
    sessionStorage.removeItem(PKCE_KEY)

    if (!code || !stored || returnedState !== stored.state) {
      throw new Error('Login could not be confirmed. Start sign-in again.')
    }

    const tokens = await exchangeCode(code, stored.codeVerifier)
    const session: WhopSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      obtainedAt: Date.now(),
      companyId: whopAccountId,
      user: await fetchUser(tokens.access_token),
    }
    writeSession(session)
    return session
  })()

  return callbackInflight
}

export const logoutWhop = async (): Promise<void> => {
  const session = readSession()
  sessionStorage.removeItem(SESSION_KEY)
  if (!session?.refreshToken) return

  await fetch(`${whopApiOrigin}/oauth/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: session.refreshToken,
      client_id: whopAppId,
    }),
  }).catch(() => undefined)
}
