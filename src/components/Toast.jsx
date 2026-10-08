import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const ToastContext = createContext(() => {})

// Small confirmations ("Added to your plan") that fade away on their own.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const toast = useCallback((message, tone = 'ok') => {
    counter.current += 1
    const id = counter.current
    setToasts((list) => [...list.slice(-2), { id, message, tone }])
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 2800)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <Icon name={t.tone === 'warn' ? 'alert' : 'check'} size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
