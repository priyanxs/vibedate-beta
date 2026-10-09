import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { BG_MUSIC } from '../musicConfig'

/* Background song, played by YouTube's own embedded player.
   - It starts by itself, muted (browsers only allow silent autoplay), and the sound switches on at the visitor's
     first tap, click or key press (browsers require that gesture before any page may make sound).
   - A small card keeps the player visible, as YouTube requires, with mute and close buttons.
   - The choice to close it is remembered on this device. The song pauses while the tab is hidden. */

const KEY = 'vibedate:bgmusic'
const ORIGIN = 'https://www.youtube-nocookie.com'
const VOLUME = 35

const read = () => {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}
const write = (on) => {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    /* storage unavailable: the player still works */
  }
}

export default function BackgroundMusic() {
  const [on, setOn] = useState(read)
  const [muted, setMuted] = useState(true)
  const frame = useRef(null)
  const mutedRef = useRef(true)

  const send = useCallback((func, args = []) => {
    const win = frame.current && frame.current.contentWindow
    if (!win) return
    try {
      win.postMessage(JSON.stringify({ event: 'command', func, args }), ORIGIN)
    } catch {
      /* the frame is not ready yet */
    }
  }, [])

  const listen = useCallback(() => {
    const win = frame.current && frame.current.contentWindow
    if (!win) return
    try {
      win.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), ORIGIN)
    } catch {
      /* ignore */
    }
  }, [])

  const applyMute = useCallback(
    (shouldMute) => {
      mutedRef.current = shouldMute
      setMuted(shouldMute)
      if (shouldMute) {
        send('mute')
      } else {
        send('unMute')
        send('setVolume', [VOLUME])
        send('playVideo')
      }
    },
    [send],
  )

  // First tap / click / key press: switch the sound on. (Commands are repeated briefly in case the player is still loading.)
  useEffect(() => {
    if (!on) return undefined
    const events = ['pointerdown', 'keydown', 'touchstart']
    let timers = []
    const remove = () => events.forEach((n) => window.removeEventListener(n, onGesture))
    function onGesture(e) {
      remove()
      if (e.target instanceof Element && e.target.closest('.bgm')) return // the card's own buttons decide
      if (!mutedRef.current) return
      listen()
      applyMute(false)
      timers = [400, 1200, 2500].map((ms) => setTimeout(() => applyMute(false), ms))
    }
    events.forEach((n) => window.addEventListener(n, onGesture, { passive: true }))
    return () => {
      remove()
      timers.forEach(clearTimeout)
    }
  }, [on, applyMute, listen])

  // Pause while the tab is hidden, resume when it is back.
  useEffect(() => {
    if (!on) return undefined
    const onVisibility = () => send(document.hidden ? 'pauseVideo' : 'playVideo')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [on, send])

  const close = () => {
    setOn(false)
    write(false)
  }
  const open = () => {
    mutedRef.current = true
    setMuted(true)
    setOn(true)
    write(true)
  }

  if (!on) {
    return (
      <button type="button" className="bgm-open glass" onClick={open} aria-label="Play background music">
        <Icon name="music" size={16} /> <span>Play music</span>
      </button>
    )
  }

  const origin = typeof window !== 'undefined' && window.location ? window.location.origin : ''
  const src =
    `https://www.youtube-nocookie.com/embed/${BG_MUSIC.id}?autoplay=1&mute=1&loop=1&playlist=${BG_MUSIC.id}` +
    `&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`

  return (
    <aside className="bgm glass" aria-label="Background music">
      <div className="bgm__head">
        <span className="bgm__title">
          <Icon name="music" size={14} />
          <span>
            <strong>{BG_MUSIC.title}</strong>
            <small>{BG_MUSIC.by}</small>
          </span>
        </span>
        <span className="bgm__buttons">
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              listen()
              applyMute(!muted)
            }}
            aria-pressed={!muted}
            aria-label={muted ? 'Turn the music sound on' : 'Mute the music'}
            title={muted ? 'Sound on' : 'Mute'}
          >
            <Icon name={muted ? 'musicOff' : 'music'} size={16} />
          </button>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close the music player" title="Close">
            <Icon name="x" size={16} />
          </button>
        </span>
      </div>
      <div className="bgm__frame">
        <iframe
          ref={frame}
          title={`${BG_MUSIC.title} (YouTube player)`}
          src={src}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={listen}
        />
      </div>
      {muted && <p className="bgm__hint">Tap anywhere on the page to turn the sound on.</p>}
    </aside>
  )
}
