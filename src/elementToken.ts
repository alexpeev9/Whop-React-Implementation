import { whopAccountId, whopApiKey, whopApiOrigin } from './config'

type CachedToken = {
  token: string
  expiresAt: number
}

let cached: CachedToken | null = null

export const getElementToken = async (): Promise<string> => {
  if (cached && cached.expiresAt - Date.now() > 60_000) return cached.token

  const response = await fetch(`${whopApiOrigin}/api/v1/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${whopApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ account_id: whopAccountId }),
  })

  const body = (await response.json().catch(() => ({}))) as {
    token?: string
    expires_at?: string
    error?: { message?: string }
  }

  if (!response.ok || !body.token) {
    throw new Error(body.error?.message || 'Could not create a Whop element token.')
  }

  cached = {
    token: body.token,
    expiresAt: body.expires_at ? Date.parse(body.expires_at) : Date.now() + 50 * 60 * 1000,
  }
  return body.token
}

export const fetchAccountTitle = async (): Promise<string> => {
  const response = await fetch(`${whopApiOrigin}/api/v1/companies/${whopAccountId}`, {
    headers: { Authorization: `Bearer ${whopApiKey}` },
  })
  if (!response.ok) return whopAccountId
  const body = (await response.json()) as { title?: string | null }
  return body.title || whopAccountId
}
