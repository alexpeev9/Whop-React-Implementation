export const whopAppId = import.meta.env.VITE_WHOP_APP_ID
export const whopAccountId = import.meta.env.VITE_WHOP_ACCOUNT_ID
export const whopApiKey = import.meta.env.VITE_WHOP_API_KEY
export const whopApiOrigin = import.meta.env.VITE_WHOP_API_ORIGIN || 'https://api.whop.com'

export const oauthRedirectUri = 'http://localhost:5173/oauth/callback'

export const configError = (): string | null => {
  if (!whopAppId) return 'Missing VITE_WHOP_APP_ID in .env.local.'
  if (!whopAccountId) return 'Missing VITE_WHOP_ACCOUNT_ID in .env.local.'
  if (!whopApiKey) return 'Missing WHOP_API_KEY in .env.local.'
  if (window.location.origin !== 'http://localhost:5173') {
    return 'Open this proof of concept at http://localhost:5173 so Whop can send you back after login.'
  }
  return null
}
