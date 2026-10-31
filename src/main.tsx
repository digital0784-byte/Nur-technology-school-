import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const stackLines = this.state.error.stack
        ? this.state.error.stack.split('\n').slice(0, 5).join('\n')
        : '';

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#111827', minHeight: '100vh', padding: '32px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
            Application Error
          </h1>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', lineHeight: 1.5 }}>
            {this.state.error.message}
          </div>
          {stackLines && (
            <pre style={{ fontSize: '16px', backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.6 }}>
              {stackLines}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '24px', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
