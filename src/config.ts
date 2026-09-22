export const whopAppId = import.meta.env.VITE_WHOP_APP_ID
export const whopAccountId = import.meta.env.VITE_WHOP_ACCOUNT_ID
export const whopApiKey = import.meta.env.VITE_WHOP_API_KEY
export const whopApiOrigin = import.meta.env.VITE_WHOP_API_ORIGIN || 'https://api.whop.com'

export const oauthRedirectUri = `${window.location.origin}/oauth/callback`

export const configError = (): string | null => {
  if (!whopAppId) return 'Missing VITE_WHOP_APP_ID.'
  if (!whopAccountId) return 'Missing VITE_WHOP_ACCOUNT_ID.'
  if (!whopApiKey) return 'Missing WHOP_API_KEY.'
  return null
}
