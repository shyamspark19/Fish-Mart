import React, { createContext, useContext, useState, useEffect } from 'react'

export interface LocationData {
  address: string
  area: string
  city: string
  lat: number
  lng: number
  pincode: string
}

interface LocationContextType {
  location: LocationData
  setLocation: (loc: LocationData) => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const defaultLocation: LocationData = {
  address: 'No. 45, Nageswara Road, T. Nagar',
  area: 'T. Nagar',
  city: 'Chennai',
  lat: 13.0418,
  lng: 80.2341,
  pincode: '600017'
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData>(() => {
    const saved = localStorage.getItem('ocean_location')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { return defaultLocation }
    }
    return defaultLocation
  })

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const setLocation = (loc: LocationData) => {
    setLocationState(loc)
    localStorage.setItem('ocean_location', JSON.stringify(loc))
  }

  return (
    <LocationContext.Provider value={{ location, setLocation, isModalOpen, setIsModalOpen }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used within LocationProvider')
  return ctx
}
