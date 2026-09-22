interface ImportMetaEnv {
  readonly VITE_WHOP_APP_ID: string
  readonly VITE_WHOP_ACCOUNT_ID: string
  readonly VITE_WHOP_ENVIRONMENT: string
  readonly VITE_WHOP_API_KEY: string
  readonly VITE_WHOP_API_ORIGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
