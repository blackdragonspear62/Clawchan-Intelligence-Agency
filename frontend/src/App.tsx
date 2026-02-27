import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Layout } from './components/Layout'
import { LoadingScreen } from './components/LoadingScreen'
import { ErrorFallback } from './components/ErrorFallback'

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const GlobeView = lazy(() => import('./pages/GlobeView'))
const AircraftTracking = lazy(() => import('./pages/AircraftTracking'))
const SatelliteTracking = lazy(() => import('./pages/SatelliteTracking'))
const DisasterMonitor = lazy(() => import('./pages/DisasterMonitor'))
const EconomicWarfare = lazy(() => import('./pages/EconomicWarfare'))
const LiveIntel = lazy(() => import('./pages/LiveIntel'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/globe" element={<GlobeView />} />
            <Route path="/aircraft" element={<AircraftTracking />} />
            <Route path="/satellites" element={<SatelliteTracking />} />
            <Route path="/disasters" element={<DisasterMonitor />} />
            <Route path="/economic" element={<EconomicWarfare />} />
            <Route path="/intel" element={<LiveIntel />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
