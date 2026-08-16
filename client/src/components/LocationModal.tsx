import React, { useState } from 'react'
import { useLocation, LocationData } from '../context/LocationContext'
import { useLanguage } from '../context/LanguageContext'

const PRESET_LOCATIONS: LocationData[] = [
  {
    address: 'No. 45, Nageswara Rao Park Road, T. Nagar',
    area: 'T. Nagar',
    city: 'Chennai',
    lat: 13.0418,
    lng: 80.2341,
    pincode: '600017'
  },
  {
    address: 'Plot 12, 100 Feet Bypass Road, Velachery',
    area: 'Velachery',
    city: 'Chennai',
    lat: 12.9815,
    lng: 80.218,
    pincode: '600042'
  },
  {
    address: '2nd Avenue, Near Tower Park, Anna Nagar',
    area: 'Anna Nagar',
    city: 'Chennai',
    lat: 13.0878,
    lng: 80.2117,
    pincode: '600040'
  },
  {
    address: 'Lattice Bridge Road, Adyar',
    area: 'Adyar',
    city: 'Chennai',
    lat: 13.0012,
    lng: 80.2565,
    pincode: '600020'
  },
  {
    address: 'Elliot’s Beach Promenade, Besant Nagar',
    area: 'Besant Nagar',
    city: 'Chennai',
    lat: 13.0002,
    lng: 80.2667,
    pincode: '600090'
  },
  {
    address: 'IT Expressway, Navalur, OMR',
    area: 'OMR - Navalur',
    city: 'Chennai',
    lat: 12.8449,
    lng: 80.2263,
    pincode: '603103'
  }
]

export default function LocationModal() {
  const { location, setLocation, isModalOpen, setIsModalOpen } = useLocation()
  const { t } = useLanguage()
  const [selectedLoc, setSelectedLoc] = useState<LocationData>(location)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [flatNo, setFlatNo] = useState('')

  if (!isModalOpen) return null

  const handleDetectLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc: LocationData = {
            address: `Current Pin Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
            area: 'Detected GPS Location',
            city: 'Chennai',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            pincode: '600001'
          }
          setSelectedLoc(newLoc)
          setIsLocating(false)
        },
        () => {
          alert('GPS permission denied or unavailable. Using default location.')
          setIsLocating(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
      setIsLocating(false)
    }
  }

  const handleSave = () => {
    const finalAddress = flatNo
      ? `${flatNo}, ${selectedLoc.address}`
      : selectedLoc.address
    setLocation({ ...selectedLoc, address: finalAddress })
    setIsModalOpen(false)
  }

  const filteredPresets = PRESET_LOCATIONS.filter(p =>
    p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white border border-cyan-100 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{t('deliveryAddress')}</h2>
              <p className="text-xs text-cyan-200/80">Pin your location for 90-minute fresh delivery</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search & Detect */}
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search area, landmark or street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
              <span>{isLocating ? 'Locating GPS Position...' : 'Use My Current GPS Location'}</span>
            </button>
          </div>

          {/* Google Maps / Interactive Location Pin Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 h-48 group">
            {/* Embed Map Preview */}
            <iframe
              title="Google Maps Location Picker"
              src={`https://maps.google.com/maps?q=${selectedLoc.lat},${selectedLoc.lng}&z=14&output=embed`}
              className="w-full h-full border-0 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            ></iframe>

            {/* Floating Map Overlay Info */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="truncate">
                  <div className="text-xs font-bold text-cyan-400">{selectedLoc.area}, {selectedLoc.city}</div>
                  <div className="text-[11px] text-slate-300 truncate">{selectedLoc.address}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-md border border-cyan-500/30 whitespace-nowrap">
                Selected Pin
              </span>
            </div>
          </div>

          {/* Quick Preset Location Pills */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
              Popular Chennai Delivery Areas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLoc(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedLoc.area === preset.area
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-transparent shadow-md shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="text-xs font-black">{preset.area}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${selectedLoc.area === preset.area ? 'text-sky-100' : 'text-slate-500'}`}>
                    {preset.city} - {preset.pincode}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* House / Flat Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">House / Flat / Door Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Flat 3B, Sunshine Apartments"
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {t('deliveringTo')}: <strong className="text-slate-800">{selectedLoc.area}</strong>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-transform active:scale-95"
          >
            Confirm & Save Location
          </button>
        </div>
      </div>
    </div>
  )
}
