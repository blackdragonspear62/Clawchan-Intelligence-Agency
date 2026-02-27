import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'

import App from './App'
import './styles/index.css'

// Configure React Query with aggressive caching for real-time data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// Error boundary for Three.js canvas
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">WebGL Error</h2>
            <p className="text-slate-400">
              Your browser may not support WebGL. Please try a different browser.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CanvasErrorBoundary>
          <App />
        </CanvasErrorBoundary>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
      <Leva hidden={process.env.NODE_ENV === 'production'} />
    </QueryClientProvider>
  </React.StrictMode>
)
