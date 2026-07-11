import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center bg-surface p-6">
        <div className="w-full max-w-md rounded-xl border border-line bg-raised p-6 text-center">
          <i className="bi bi-exclamation-triangle text-3xl text-warn" />
          <h1 className="mt-3 text-lg font-black text-content">Something broke on this page</h1>
          <p className="mt-1 text-sm text-subtle">
            An error stopped this page from rendering. The details are in the browser console.
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-muted p-3 text-left text-[11px] text-subtle">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink"
            >
              Reload
            </button>
            <a
              href="/user/home"
              className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-subtle"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
