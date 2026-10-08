import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { MUSIC_TRACKS } from '../musicConfig'

/* Soothing background music — a looping playlist (see ../musicConfig.js; all public-domain piano and guitar).
   Browsers block sound until the visitor interacts with the page, so playback starts on the first click, tap or
   key press — unless they switched the music off (remembered on this device). */

const KEY = 'vibedate:music'
const VOLUME = 0.35
const TRACKS = MUSIC_TRACKS

export default function MusicPlayer() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== 'off'
    } catch {
      return true
    }
  })
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(0)
  const enabledRef = useRef(enabled)
  const api = useRef({ start: () => {}, stop: () => {} })

  enabledRef.current = enabled

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

    api.current = { start, stop }

    // The first real interaction unlocks audio.
    const events = ['pointerdown', 'keydown', 'touchstart']
    const removeGestureListeners = () => events.forEach((n) => window.removeEventListener(n, onGesture))
    function onGesture(e) {
      removeGestureListeners()
      if (e.target instanceof Element && e.target.closest('.music-btn')) return // the button handles itself
      if (enabledRef.current && !(audio && !audio.paused)) start()
    }
    events.forEach((n) => window.addEventListener(n, onGesture, { passive: true }))

    // Be polite: pause while the tab is in the background.
    const onVisibility = () => {
      if (!audio) return
      if (document.hidden) {
        if (!audio.paused) {
          resumeOnShow = true
          audio.pause()
        }
      } else if (resumeOnShow && enabledRef.current) {
        resumeOnShow = false
        start()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (enabledRef.current) start() // works if the browser already allows audio for this site

    return () => {
      removeGestureListeners()
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(fadeTimer)
      if (audio) audio.pause()
    }
  }, [])

  const toggle = () => {
    const next = !playing
    setEnabled(next)
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off')
    } catch {
      /* ignore */
    }
    if (next) api.current.start()
    else api.current.stop()
  }

  return (
    <button
      type="button"
      className={`music-btn ${playing ? 'is-playing' : ''} ${enabled && !playing ? 'is-waiting' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={`${TRACKS[track].title} — ${TRACKS[track].artist}`}
    >
      {playing ? (
        <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
      ) : (
        <Icon name="musicOff" size={18} />
      )}
    </button>
  )
}
