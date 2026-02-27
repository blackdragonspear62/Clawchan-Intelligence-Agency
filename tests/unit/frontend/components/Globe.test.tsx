import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Globe } from '../../../../frontend/src/components/Globe'

// Mock Three.js
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    camera: { position: { set: vi.fn() } },
    scene: { add: vi.fn(), remove: vi.fn() },
  }),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
  Stars: () => <div data-testid="mock-stars" />,
}))

vi.mock('three-globe', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    globeImageUrl: vi.fn().mockReturnThis(),
    bumpImageUrl: vi.fn().mockReturnThis(),
    showAtmosphere: vi.fn().mockReturnThis(),
    pointsData: vi.fn().mockReturnThis(),
    pointAltitude: vi.fn().mockReturnThis(),
    pointColor: vi.fn().mockReturnThis(),
    pointRadius: vi.fn().mockReturnThis(),
    arcsData: vi.fn().mockReturnThis(),
    arcColor: vi.fn().mockReturnThis(),
    arcStroke: vi.fn().mockReturnThis(),
    arcDashLength: vi.fn().mockReturnThis(),
    arcDashGap: vi.fn().mockReturnThis(),
    arcDashAnimateTime: vi.fn().mockReturnThis(),
  })),
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

describe('Globe Component', () => {
  it('renders without crashing', () => {
    const queryClient = createTestQueryClient()
    
    render(
      <QueryClientProvider client={queryClient}>
        <Globe />
      </QueryClientProvider>
    )
    
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument()
  })

  it('renders orbit controls', () => {
    const queryClient = createTestQueryClient()
    
    render(
      <QueryClientProvider client={queryClient}>
        <Globe />
      </QueryClientProvider>
    )
    
    expect(screen.getByTestId('mock-orbit-controls')).toBeInTheDocument()
  })

  it('renders stars background', () => {
    const queryClient = createTestQueryClient()
    
    render(
      <QueryClientProvider client={queryClient}>
        <Globe />
      </QueryClientProvider>
    )
    
    expect(screen.getByTestId('mock-stars')).toBeInTheDocument()
  })
})
