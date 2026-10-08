// Colour themes. The actual colours live in index.css under [data-theme="..."].
export const THEMES = [
  { id: 'golden', name: 'Golden Hour', note: 'Warm saffron and gold', swatch: ['#110b09', '#c2410c', '#ffa05c', '#fbbf24'], meta: '#110b09' },
  { id: 'midnight', name: 'Midnight Velvet', note: 'Crimson, pink and lime', swatch: ['#0d0812', '#e11d48', '#ff5c7c', '#a3e635'], meta: '#0d0812' },
  { id: 'lavender', name: 'Lavender Dusk', note: 'Violet night with rose', swatch: ['#0b0a1c', '#7c3aed', '#b794ff', '#f472b6'], meta: '#0b0a1c' },
  { id: 'blush', name: 'Blush Day', note: 'Light, soft pink', swatch: ['#fff5f8', '#c8102e', '#e94a78', '#a3e635'], meta: '#fff5f8' },
]

export const DEFAULT_THEME = 'golden'
export const THEME_KEY = 'vibedate:theme'

export const applyTheme = (id) => {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0]
  document.documentElement.setAttribute('data-theme', theme.id)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme.meta)
  return theme
}
