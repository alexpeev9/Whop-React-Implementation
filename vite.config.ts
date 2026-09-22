import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
    },
    define: {
      'import.meta.env.VITE_WHOP_API_KEY': JSON.stringify(env.WHOP_API_KEY ?? ''),
      'import.meta.env.VITE_WHOP_API_ORIGIN': JSON.stringify(
        env.WHOP_API_ORIGIN || 'https://api.whop.com',
      ),
    },
  }
})
