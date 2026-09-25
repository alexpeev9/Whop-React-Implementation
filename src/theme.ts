import type { Appearance } from '@whop/elements'

export type ThemeId = 'midnight' | 'blue' | 'purple'

type ThemeDef = {
  id: ThemeId
  label: string
  /** Accent swatch for the switch, so the button shows the theme it selects. */
  swatch: string
  /** Whop Elements only accepts named accent scales, not arbitrary colors. */
  accentColor: NonNullable<NonNullable<Appearance['theme']>['accentColor']>
  grayColor: NonNullable<NonNullable<Appearance['theme']>['grayColor']>
}

export const themes: ThemeDef[] = [
  { id: 'midnight', label: 'Dark blue', swatch: 'oklch(0.58 0.15 268)', accentColor: 'indigo', grayColor: 'slate' },
  { id: 'blue', label: 'Blue', swatch: 'oklch(0.66 0.18 260)', accentColor: 'blue', grayColor: 'slate' },
  { id: 'purple', label: 'Purple', swatch: 'oklch(0.68 0.17 305)', accentColor: 'violet', grayColor: 'mauve' },
]

export const defaultTheme: ThemeId = 'blue'

export const isThemeId = (value: unknown): value is ThemeId =>
  themes.some((theme) => theme.id === value)

const STORAGE_KEY = 'roas.theme'

export const readStoredTheme = (): ThemeId => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isThemeId(stored) ? stored : defaultTheme
  } catch {
    return defaultTheme
  }
}

export const storeTheme = (theme: ThemeId) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Private-mode storage failures should not break theming.
  }
}
