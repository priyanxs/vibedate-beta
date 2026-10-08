// Applies the saved colour theme before the page paints (no flash). Kept as a file, not inline, so the
// Content-Security-Policy can forbid inline scripts.
try {
  var t = localStorage.getItem('vibedate:theme')
  if (/^(rose|sapphire|emerald|ivory)$/.test(t)) document.documentElement.setAttribute('data-theme', t)
} catch (e) {}
