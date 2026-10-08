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

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="crash" role="alert">
        <h1>Something went wrong</h1>
        <p>Sorry — VibeDate hit a problem. Your plan is saved on this device.</p>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>Reload the page</button>
      </main>
    )
  }
}
