import type { ReactNode } from 'react'
import { userLabel, type WhopUser } from '../auth'
import type { ThemeId } from '../theme'
import { ThemeSwitch } from './ThemeSwitch'

type ShellProps = {
  path: string
  user: WhopUser
  accountTitle: string
  onNavigate: (path: string) => void
  theme: ThemeId
  onThemeChange: (theme: ThemeId) => void
  onLogout: () => void
  children: ReactNode
}

const links = [
  { href: '/ads', label: 'ROAS Ads' },
  { href: '/payments', label: 'ROAS Payments' },
]

export const Shell = ({
  path,
  user,
  accountTitle,
  onNavigate,
  onLogout,
  theme,
  onThemeChange,
  children,
}: ShellProps) => {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <div>
            <strong>ROAS Labs</strong>
            <span>{accountTitle}</span>
          </div>
        </div>
        <nav aria-label="Portal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={path === link.href ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(link.href)
              }}
            >
              {link.label}
            </a>
          ))}
          <ThemeSwitch theme={theme} onThemeChange={onThemeChange} />
        </nav>
        <div className="session">
          <span>{userLabel(user)}</span>
          <button type="button" className="text" onClick={onLogout} aria-label="Sign out">
            Sign out
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
