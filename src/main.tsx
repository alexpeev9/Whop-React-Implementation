import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Whop Elements destroys its handle in effect cleanup. React Strict Mode runs that
// cleanup once on mount in development, so every embed stays blank and later calls
// throw "this handle was torn down".
createRoot(document.getElementById('root')!).render(<App />)
