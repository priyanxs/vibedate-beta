import { Fragment, useEffect, useRef, useState } from 'react'
import { WINGMAN_PROMPTS } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { askWingman, getAiMode, getStoredKey, storeKey } from '../services/ai'
import Icon from './Icon.jsx'

const GREETING = {
  role: 'assistant',
  text: "Hi, I'm your **Wingman** 💘 Ask me about conversation starters, etiquette, what to wear, or how to make your date feel special.",
}

// Tiny renderer: "- " bullets and **bold** only. Everything is rendered as text (never as HTML).
const renderInline = (line) =>
  line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  )

function MessageBody({ text }) {
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <div key={i} className="chat__gap" />
    if (line.startsWith('- ')) return <p key={i} className="chat__bullet">{renderInline(line.slice(2))}</p>
    return <p key={i}>{renderInline(line)}</p>
  })
}

export default function WingmanChat() {
  const { vibe, venue, budget, total, remaining, cityInfo } = useDate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [mode, setMode] = useState(getAiMode)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const fabRef = useRef(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open && endRef.current) endRef.current.scrollIntoView({ block: 'end' })
  }, [messages, busy, open])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
    // Give focus back to the launcher button when the chat closes.
    if (!open && wasOpen.current && fabRef.current) fabRef.current.focus()
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (raw) => {
    const text = raw.trim()
    if (!text || busy) return
    const history = [...messages, { role: 'user', text }]
    setMessages(history)
    setInput('')
    setBusy(true)
    // A short pause makes mock replies feel conversational; real API calls take longer anyway.
    await new Promise((r) => setTimeout(r, 450))
    const reply = await askWingman(history, { vibe, venue, budget, total, remaining, city: cityInfo.name, cityId: cityInfo.id })
    setMessages((m) => [...m, { role: 'assistant', text: reply.text }])
    setBusy(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const saveKey = () => {
    storeKey(keyInput.trim())
    setKeyInput('')
    setMode(getAiMode())
    setShowSettings(false)
  }

  const removeKey = () => {
    storeKey('')
    setMode(getAiMode())
  }

  return (
    <>
      {!open && (
        <button ref={fabRef} type="button" className="fab" onClick={() => setOpen(true)} aria-label="Open AI Wingman chat">
          <Icon name="sparkles" size={22} />
          <span className="fab__label">Ask Wingman</span>
        </button>
      )}

      {open && (
        <section className="chat glass" role="dialog" aria-label="AI Wingman chat">
          <header className="chat__head">
            <div className="chat__who">
              <span className="chat__avatar"><Icon name="sparkles" size={18} /></span>
              <div>
                <p className="chat__name">AI Wingman</p>
                <p className="chat__status">{mode === 'builtin' ? 'Built-in assistant · works offline' : 'Live AI (Gemini)'}</p>
              </div>
            </div>
            <div className="chat__head-actions">
              <button type="button" className="icon-btn" onClick={() => setShowSettings((s) => !s)} aria-label="Wingman settings" aria-expanded={showSettings}>
                <Icon name="settings" size={18} />
              </button>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
                <Icon name="x" size={18} />
              </button>
            </div>
          </header>

          {showSettings && (
            <div className="chat__settings">
              <p>
                The assistant works with no setup and answers on your device. For live AI answers, paste your own free <strong>Gemini API key</strong> (get one in a minute at{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com/apikey</a>). The key stays in this browser, and with a key your chat messages are sent to Google.
              </p>
              <div className="chat__key-row">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={getStoredKey() ? 'Key saved — paste a new one to replace' : 'Paste API key'}
                  autoComplete="off"
                  aria-label="Gemini API key"
                />
                <button type="button" className="btn btn--primary btn--sm" onClick={saveKey} disabled={!keyInput.trim()}>Save</button>
              </div>
              {getStoredKey() && (
                <button type="button" className="link-btn" onClick={removeKey}>Remove saved key</button>
              )}
            </div>
          )}

          <div className="chat__body" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`bubble bubble--${m.role}`}>
                <MessageBody text={m.text} />
              </div>
            ))}
            {busy && (
              <div className="bubble bubble--assistant" aria-label="Wingman is typing">
                <span className="typing"><i /><i /><i /></span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="chat__quick">
            {WINGMAN_PROMPTS.map((p) => (
              <button key={p} type="button" className="chip chip--sm" onClick={() => send(p)} disabled={busy}>{p}</button>
            ))}
          </div>

          <form className="chat__form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your wingman…"
              aria-label="Message to Wingman"
              maxLength={500}
            />
            <button type="submit" className="btn btn--primary btn--icon" disabled={busy || !input.trim()} aria-label="Send">
              <Icon name="send" size={18} />
            </button>
          </form>
        </section>
      )}
    </>
  )
}
