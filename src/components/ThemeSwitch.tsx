import { themes, type ThemeId } from '../theme'

type ThemeSwitchProps = {
  theme: ThemeId
  onThemeChange: (theme: ThemeId) => void
}

export const ThemeSwitch = ({ theme, onThemeChange }: ThemeSwitchProps) => {
  return (
    <div className="theme-switch" role="radiogroup" aria-label="Color theme">
      {themes.map((entry) => (
        <button
          key={entry.id}
          type="button"
          role="radio"
          aria-checked={theme === entry.id}
          title={entry.label}
          onClick={() => onThemeChange(entry.id)}
        >
          <span className="swatch" style={{ background: entry.swatch }} aria-hidden="true" />
          <span className="theme-switch-label">{entry.label}</span>
        </button>
      ))}
    </div>
  )
}
