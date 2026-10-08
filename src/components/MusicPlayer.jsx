import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { DEFAULT_YOUTUBE, MUSIC_TRACKS } from '../musicConfig'

/* Background music.
   1) Built-in playlist: public-domain piano and guitar (see ../musicConfig.js). Browsers block sound until the
      visitor interacts with the page, so it starts on the first click, tap or key press — unless they switched it off.
   2) Optional YouTube track: paste any YouTube link in the panel and it plays in YouTube's official player
      (visible, as YouTube requires). This is how you can add a song such as a Bollywood instrumental without
      bundling copyrighted audio into the site. */

const KEY = 'vibedate:music'
const YT_KEY = 'vibedate:youtube'
const VOLUME = 0.35
const TRACKS = MUSIC_TRACKS

export const parseYouTubeId = (input) => {
  const text = String(input || '').trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text
  try {
    const url = new URL(text)
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0]
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : ''
    }
    if (host === 'youtube.com' || host === 'music.youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v')
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v
      const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/)
      if (m) return m[1]
    }
  } catch {
    /* not a URL */
  }
  return ''
}

const readStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v
  } catch {
    return fallback
  }
}

export default function MusicPlayer() {
  const [enabled, setEnabled] = useState(() => readStored(KEY, 'on') !== 'off')
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(0)
  const [open, setOpen] = useState(false)
  const [ytId, setYtId] = useState(() => parseYouTubeId(readStored(YT_KEY, '')) || parseYouTubeId(DEFAULT_YOUTUBE))
  const [ytOn, setYtOn] = useState(false)
  const [ytInput, setYtInput] = useState('')
  const [ytError, setYtError] = useState('')
  const enabledRef = useRef(enabled)
  const ytOnRef = useRef(false)
  const box = useRef(null)
  const api = useRef({ start: () => {}, stop: () => {}, next: () => {} })

  enabledRef.current = enabled
  ytOnRef.current = ytOn

  useEffect(() => {
    let audio = null
    let index = 0
    let fadeTimer = 0
    let resumeOnShow = false
    const url = (i) => `${import.meta.env.BASE_URL}${TRACKS[i].src}`

    const ensure = () => {
      if (audio) return audio
      audio = new Audio()
      audio.preload = 'none'
      audio.volume = 0
      audio.src = url(0)
      audio.addEventListener('playing', () => setPlaying(true))
      audio.addEventListener('pause', () => setPlaying(false))
      audio.addEventListener('ended', () => {
        index = (index + 1) % TRACKS.length
        setTrack(index)
        audio.src = url(index)
        audio.play().catch(() => {})
      })
      return audio
    }

    const fadeTo = (target, ms, done) => {
      if (!audio) return
      clearInterval(fadeTimer)
      const from = audio.volume
      const steps = Math.max(1, Math.round(ms / 50))
      let i = 0
      fadeTimer = setInterval(() => {
        i += 1
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * (i / steps)))
        if (i >= steps) {
          clearInterval(fadeTimer)
          if (done) done()
        }
      }, 50)
    }

    const start = async () => {
      if (ytOnRef.current) return false
      const el = ensure()
      try {
        await el.play()
        fadeTo(VOLUME, 1800)
        return true
      } catch {
        return false // blocked until the visitor interacts with the page
      }
    }

    const stop = () => {
      if (!audio) return
      fadeTo(0, 500, () => audio.pause())
    }

    const next = () => {
      const el = ensure()
      index = (index + 1) % TRACKS.length
      setTrack(index)
      el.src = url(index)
      el.play().then(() => fadeTo(VOLUME, 800)).catch(() => {})
    }

    api.current = { start, stop, next }

    const events = ['pointerdown', 'keydown', 'touchstart']
    const removeGestureListeners = () => events.forEach((n) => window.removeEventListener(n, onGesture))
    function onGesture(e) {
      removeGestureListeners()
      if (e.target instanceof Element && e.target.closest('.music-group')) return // the controls handle themselves
      if (enabledRef.current && !ytOnRef.current && !(audio && !audio.paused)) start()
    }
    events.forEach((n) => window.addEventListener(n, onGesture, { passive: true }))

    const onVisibility = () => {
      if (!audio) return
      if (document.hidden) {
        if (!audio.paused) {
          resumeOnShow = true
          audio.pause()
        }
      } else if (resumeOnShow && enabledRef.current && !ytOnRef.current) {
        resumeOnShow = false
        start()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (enabledRef.current) start()

    return () => {
      removeGestureListeners()
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(fadeTimer)
      if (audio) audio.pause()
    }
  }, [])

  // Close the panel on Escape or an outside click.
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

  const save = (key, value) => {
    try {
      if (value) localStorage.setItem(key, value)
      else localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }

  const togglePlaylist = () => {
    if (ytOn) {
      // go back to the built-in playlist
      setYtOn(false)
      ytOnRef.current = false
      setEnabled(true)
      save(KEY, 'on')
      api.current.start()
      return
    }
    const next = !playing
    setEnabled(next)
    save(KEY, next ? 'on' : 'off')
    if (next) api.current.start()
    else api.current.stop()
  }

  const playYouTube = (id) => {
    api.current.stop()
    setYtId(id)
    save(YT_KEY, id)
    setYtOn(true)
    ytOnRef.current = true
  }

  const submitYouTube = (e) => {
    e.preventDefault()
    const id = parseYouTubeId(ytInput)
    if (!id) {
      setYtError('That does not look like a YouTube link. Try the full link from the Share button.')
      return
    }
    setYtError('')
    setYtInput('')
    playYouTube(id)
  }

  const removeYouTube = () => {
    setYtOn(false)
    ytOnRef.current = false
    setYtId('')
    save(YT_KEY, '')
  }

  const active = playing || ytOn

  return (
    <div className="music-group" ref={box}>
      <button
        type="button"
        className={`music-btn ${active ? 'is-playing' : ''} ${enabled && !active ? 'is-waiting' : ''}`}
        onClick={togglePlaylist}
        aria-pressed={active}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
        title={ytOn ? 'YouTube song playing — click for the built-in piano' : `${TRACKS[track].title} — ${TRACKS[track].artist}`}
      >
        {active ? (
          <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
        ) : (
          <Icon name="musicOff" size={18} />
        )}
      </button>
      <button
        type="button"
        className="music-more"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Music options"
        title="Music options"
      >
        <Icon name="chevronDown" size={14} />
      </button>

      {open && (
        <div className="music-panel glass" role="group" aria-label="Music options">
          <p className="music-panel__h">Built-in piano</p>
          <p className="music-panel__now">
            <strong>{TRACKS[track].title}</strong>
            <span>{TRACKS[track].artist}</span>
          </p>
          <div className="music-panel__row">
            <button type="button" className="btn btn--soft btn--sm" onClick={togglePlaylist}>
              <Icon name={playing ? 'x' : 'music'} size={14} /> {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => api.current.next()} disabled={ytOn}>
              Next track <Icon name="chevronRight" size={14} />
            </button>
          </div>

          <p className="music-panel__h">Play a song from YouTube</p>
          <form className="music-panel__form" onSubmit={submitYouTube}>
            <input
              type="text"
              value={ytInput}
              onChange={(e) => setYtInput(e.target.value)}
              placeholder="Paste a YouTube link"
              aria-label="YouTube link"
              spellCheck="false"
            />
            <button type="submit" className="btn btn--primary btn--sm" disabled={!ytInput.trim()}>Play</button>
          </form>
          {ytError && <p className="music-panel__error" role="alert">{ytError}</p>}
          {ytId && !ytOn && (
            <div className="music-panel__row">
              <button type="button" className="btn btn--soft btn--sm" onClick={() => playYouTube(ytId)}>
                <Icon name="music" size={14} /> Play saved song
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={removeYouTube}>Remove</button>
            </div>
          )}
          {ytOn && ytId && (
            <>
              <div className="music-panel__player">
                <iframe
                  title="YouTube music player"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&rel=0&playsinline=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="music-panel__row">
                <button type="button" className="btn btn--ghost btn--sm" onClick={togglePlaylist}>Back to built-in piano</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={removeYouTube}>Remove song</button>
              </div>
            </>
          )}
          <p className="music-panel__note">
            YouTube songs play in YouTube’s own player, so licensing is handled by YouTube. Keep the player visible while it plays.
          </p>
        </div>
      )}
    </div>
  )
}
