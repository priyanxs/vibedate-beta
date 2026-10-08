import { useCallback, useEffect, useRef, useState } from 'react'

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

export const formatINR = (n) => {
  const v = Math.round(Number(n) || 0)
  return `${v < 0 ? '-' : ''}₹${inr.format(Math.abs(v))}`
}

export const minutesToLabel = (min) => {
  const m = ((min % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const mm = m % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`
}

const pad = (n) => String(n).padStart(2, '0')

export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISODate = (s) => {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [y, m, d] = s.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDay = (iso) => {
  const d = parseISODate(iso)
  if (!d) return ''
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
}

// Next Saturday (never today), as an ISO date string.
export const nextSaturdayISO = () => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  const add = (6 - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + add)
  return toISODate(d)
}

export const copyText = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

// Returns [copied, copy] — `copied` is true for ~2s after a successful copy.
export const useCopy = () => {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = useCallback(async (text) => {
    const ok = await copyText(text)
    setCopied(ok)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
    return ok
  }, [])
  return [copied, copy]
}
