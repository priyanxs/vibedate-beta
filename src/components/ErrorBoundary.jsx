import { Component } from 'react'

// Last line of defence: if something unexpected throws while rendering, show a friendly page instead of a blank screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('vibedate:plan:v1')
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    } catch {}
    window.location.reload()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="crash" role="alert">
        <h1>Something went wrong</h1>
        <p>Sorry — VibeDate hit a problem. You can reload or reset your plan.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>Reload the page</button>
          <button type="button" className="btn btn--ghost" onClick={this.handleResetAndReload}>Reset plan & restart</button>
        </div>
      </main>
    )
  }
}
