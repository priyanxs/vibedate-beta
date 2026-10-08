// Colour themes. The actual colours live in index.css under [data-theme="..."].
export const THEMES = [
  { id: 'rose', name: 'Rose Noir', note: 'Ruby, rose-gold and champagne', swatch: ['#0b0709', '#c0153f', '#f4b5a3', '#e8c872'], meta: '#0b0709' },
  { id: 'sapphire', name: 'Sapphire Night', note: 'Deep navy with aqua', swatch: ['#070a14', '#2f56e0', '#8fb4ff', '#5eead4'], meta: '#070a14' },
  { id: 'emerald', name: 'Emerald Velvet', note: 'Forest black with gold', swatch: ['#050d0b', '#047857', '#6ee7b7', '#f0c75e'], meta: '#050d0b' },
  { id: 'ivory', name: 'Ivory Day', note: 'Light, warm ivory', swatch: ['#faf5ee', '#b3123f', '#d6456f', '#e5b83c'], meta: '#faf5ee' },
]

export const DEFAULT_THEME = 'rose'
export const THEME_KEY = 'vibedate:theme'

export const applyTheme = (id) => {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0]
  document.documentElement.setAttribute('data-theme', theme.id)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme.meta)
  return theme
}
