import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Aircraft {
  id: string
  icao24: string
  callsign: string
  lat: number
  lng: number
  altitude: number
  speed: number
  heading: number
  lastContact: Date
}

export interface Satellite {
  id: string
  name: string
  noradId: string
  lat: number
  lng: number
  altitude: number
  velocity: number
}

export interface LayerVisibility {
  aircraft: boolean
  satellites: boolean
  earthquakes: boolean
  disasters: boolean
  conflicts: boolean
  military: boolean
  nuclear: boolean
  traffic: boolean
}

interface DashboardState {
  // Data
  aircraft: Aircraft[]
  satellites: Satellite[]
  selectedAircraft: string | null
  selectedSatellite: string | null
  
  // UI State
  layers: LayerVisibility
  sidebarOpen: boolean
  zoomLevel: number
  
  // Actions
  setAircraft: (aircraft: Aircraft[]) => void
  setSatellites: (satellites: Satellite[]) => void
  selectAircraft: (id: string | null) => void
  selectSatellite: (id: string | null) => void
  toggleLayer: (layer: keyof LayerVisibility) => void
  setSidebarOpen: (open: boolean) => void
  setZoomLevel: (level: number) => void
}

const initialLayers: LayerVisibility = {
  aircraft: false,
  satellites: false,
  earthquakes: true,
  disasters: true,
  conflicts: true,
  military: false,
  nuclear: false,
  traffic: false,
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    immer((set) => ({
      // Initial state
      aircraft: [],
      satellites: [],
      selectedAircraft: null,
      selectedSatellite: null,
      layers: initialLayers,
      sidebarOpen: true,
      zoomLevel: 2,
      
      // Actions
      setAircraft: (aircraft) =>
        set((state) => {
          state.aircraft = aircraft
        }),
        
      setSatellites: (satellites) =>
        set((state) => {
          state.satellites = satellites
        }),
        
      selectAircraft: (id) =>
        set((state) => {
          state.selectedAircraft = id
        }),
        
      selectSatellite: (id) =>
        set((state) => {
          state.selectedSatellite = id
        }),
        
      toggleLayer: (layer) =>
        set((state) => {
          state.layers[layer] = !state.layers[layer]
        }),
        
      setSidebarOpen: (open) =>
        set((state) => {
          state.sidebarOpen = open
        }),
        
      setZoomLevel: (level) =>
        set((state) => {
          state.zoomLevel = level
        }),
    })),
    {
      name: 'clawchan-dashboard-storage',
      partialize: (state) => ({
        layers: state.layers,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
