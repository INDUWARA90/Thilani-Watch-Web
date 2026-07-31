import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class RouteErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="grid min-h-[calc(100vh-180px)] place-items-center px-4 py-12">
        <section className="w-full max-w-md rounded-lg border border-red-500/20 bg-[#FFFEFA] p-6 text-center shadow-premiumSm">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-600">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-primary">Page failed to load</h1>
          <p className="mt-2 text-sm leading-6 text-primary">
            Refresh the page to request the latest app files and restore the current view.
          </p>
          <button
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-bold uppercase text-white transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-accent"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reload page
          </button>
        </section>
      </div>
    )
  }
}
