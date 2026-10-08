import { useEffect, useRef, useState } from 'react'
import { DEFAULT_THEME, THEMES, THEME_KEY, applyTheme } from '../themes'
import Icon from './Icon.jsx'

const readTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    return THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

// Palette button in the navbar: pick a colour theme (remembered on this device).
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(readTheme)
  const [open, setOpen] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const choose = (id) => {
    setTheme(id)
    try {
      localStorage.setItem(THEME_KEY, id)
    } catch {
      /* ignore */
    }
    setOpen(false)
  }

  return (
    <div className="theme-switcher" ref={box}>
      <button
        type="button"
        className="theme-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Change colour theme"
        title="Change colour theme"
      >
        <Icon name="palette" size={18} />
      </button>

      {open && (
        <div className="theme-menu glass" role="group" aria-label="Colour theme">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`theme-option ${theme === t.id ? 'is-active' : ''}`}
              aria-pressed={theme === t.id}
              onClick={() => choose(t.id)}
            >
              <span className="theme-option__swatch" aria-hidden="true">
                {t.swatch.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span className="theme-option__text">
                <strong>{t.name}</strong>
                <small>{t.note}</small>
              </span>
              {theme === t.id && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
