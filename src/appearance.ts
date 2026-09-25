import type { Appearance } from '@whop/elements'
import { themes, type ThemeId } from './theme'

export const appearanceFor = (themeId: ThemeId): Appearance => {
  const theme = themes.find((entry) => entry.id === themeId) ?? themes[1]
  return {
    theme: {
      appearance: 'dark',
      accentColor: theme.accentColor,
      grayColor: theme.grayColor,
      dangerColor: 'tomato',
      warningColor: 'amber',
      successColor: 'teal',
      infoColor: 'sky',
    },
    variables: {
      '--radius': '0.75rem',
    },
  }
}
