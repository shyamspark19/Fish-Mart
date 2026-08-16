import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext, UserAddress } from '../context/AuthContext'
import { useLocation } from '../context/LocationContext'
import { useLanguage } from '../context/LanguageContext'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
]

export default function Profile() {
  const auth = useContext(AuthContext)
  const { setLocation } = useLocation()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const user = auth?.user

  // Form states for personal info
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [photo, setPhoto] = useState(user?.photo || AVATAR_PRESETS[0])
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ADDRESSES'>('DETAILS')
  const [successMsg, setSuccessMsg] = useState('')

  // New Address Form Modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newLabel, setNewLabel] = useState('Home')
  const [newStreet, setNewStreet] = useState('')
  const [newArea, setNewArea] = useState('T. Nagar')
  const [newCity, setNewCity] = useState('Chennai')
  const [newPincode, setNewPincode] = useState('600017')
  const [setAsDefaultCheck, setSetAsDefaultCheck] = useState(false)

  const addresses: UserAddress[] = user?.addresses && user.addresses.length > 0
    ? user.addresses
    : [
        {
          id: 'addr_default_1',
          label: 'Home',
          street: 'No. 45, Nageswara Rao Park Road',
          area: 'T. Nagar',
          city: 'Chennai',
          pincode: '600017',
          isDefault: true
        }
      ]

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Please Sign In</h2>
        <p className="text-xs text-slate-400">You must be logged in to view and manage your profile.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-cyan-500 text-white font-bold text-xs uppercase rounded-xl"
        >
          {t('signIn')}
        </button>
      </div>
    )
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    try {
      await auth.updateProfile({
        name,
        phone,
        photo
      })
      setSuccessMsg(t('profileUpdatedSuccess'))
      setTimeout(() => setSuccessMsg(''), 3500)
    } catch (err: any) {
      alert('Failed to update profile. Please try again.')
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStreet || !newArea || !newCity) return

    const newAddrObj: UserAddress = {
      id: 'addr_' + Date.now(),
      label: newLabel || 'Other',
      street: newStreet,
      area: newArea,
      city: newCity,
      pincode: newPincode,
      isDefault: setAsDefaultCheck || addresses.length === 0
    }

    let updatedList = [...addresses]
    if (newAddrObj.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }))
      // Sync LocationContext with this default address
      setLocation({
        address: newAddrObj.street,
        area: newAddrObj.area,
        city: newAddrObj.city,
        pincode: newAddrObj.pincode,
        lat: 13.0418,
        lng: 80.2341
      })
    }
    updatedList.push(newAddrObj)

    await auth.updateProfile({ addresses: updatedList })
    setIsAddingAddress(false)
    setNewStreet('')
    setSuccessMsg(t('addressAddedSuccess'))
    setTimeout(() => setSuccessMsg(''), 3500)
  }

  const handleSetDefaultAddress = async (addrId: string) => {
    const updated = addresses.map(a => {
      if (a.id === addrId) {
        // Sync LocationContext
        setLocation({
          address: a.street,
          area: a.area,
          city: a.city,
          pincode: a.pincode,
          lat: 13.0418,
          lng: 80.2341
        })
        return { ...a, isDefault: true }
      }
      return { ...a, isDefault: false }
    })
    await auth.updateProfile({ addresses: updated })
  }

  const handleDeleteAddress = async (addrId: string) => {
    if (addresses.length <= 1) {
      alert('You must keep at least one saved delivery address.')
      return
    }
    const updated = addresses.filter(a => a.id !== addrId)
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true
    }
    await auth.updateProfile({ addresses: updated })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-500/20 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Photo Preview */}
        <div className="relative">
          <img
            src={photo || AVATAR_PRESETS[0]}
            alt={name || 'Customer'}
            className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400 shadow-xl shadow-cyan-500/20 bg-slate-800"
          />
          <div className="absolute bottom-0 right-0 bg-cyan-500 text-white p-1.5 rounded-full shadow-md">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{name || 'Customer'}</h1>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Customer
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">{user.email}</p>
          {phone && <p className="text-xs text-cyan-300/90 font-semibold">{phone}</p>}
        </div>

        <button
          onClick={() => {
            auth.logout()
            navigate('/login')
          }}
          className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {t('logout')}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('DETAILS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'DETAILS'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {t('personalDetails')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ADDRESSES')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'ADDRESSES'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {t('savedAddresses')} ({addresses.length})
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'DETAILS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-base font-black text-white">{t('personalDetails')}</h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{t('fullName')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                placeholder="John Doe"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{t('emailAddress')}</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{t('phoneNumber')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                placeholder="9876543210"
              />
            </div>

            {/* Photo Avatar Preset Chooser & Custom URL */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-300 block">{t('avatarPhoto')}</label>

              {/* Preset Thumbnails */}
              <div className="flex items-center gap-3">
                {AVATAR_PRESETS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhoto(presetUrl)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform ${
                      photo === presetUrl ? 'border-cyan-400 scale-110 shadow-md shadow-cyan-500/30' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Or Custom URL */}
              <input
                type="url"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="Or paste custom image URL (https://...)"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
            >
              {t('saveProfileChanges')}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Saved Delivery Addresses */}
      {activeTab === 'ADDRESSES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">{t('savedAddresses')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage multiple delivery locations for quick checkout</p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingAddress(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{t('addNewAddress')}</span>
            </button>
          </div>

          {/* Address Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  addr.isDefault
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                      {addr.label}
                    </span>

                    {addr.isDefault ? (
                      <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase">
                        {t('defaultBadge')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-slate-400 hover:text-cyan-400 underline"
                      >
                        {t('setAsDefault')}
                      </button>
                    )}
                  </div>

                  <div className="text-sm font-bold text-white leading-snug pt-1">
                    {addr.street}
                  </div>
                  <div className="text-xs text-slate-300">
                    {addr.area}, {addr.city} - {addr.pincode}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    {t('deleteAddress')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">{t('addNewAddress')}</h3>
              <button
                onClick={() => setIsAddingAddress(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              {/* Label */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">{t('addressLabel')}</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        newLabel === lbl
                          ? 'bg-cyan-500 text-white border-cyan-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">{t('streetAddress')}</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="e.g. Flat 3B, Sunshine Apartments, 1st Cross St"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Area & City */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{t('areaLocality')}</label>
                  <input
                    type="text"
                    required
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. T. Nagar"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{t('city')}</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Chennai"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">{t('pincode')}</label>
                <input
                  type="text"
                  required
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  placeholder="600017"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={setAsDefaultCheck}
                  onChange={(e) => setSetAsDefaultCheck(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>{t('setAsDefault')}</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-black text-xs uppercase rounded-xl shadow-md transition-transform active:scale-95"
                >
                  {t('saveAddress')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
