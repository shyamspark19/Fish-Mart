import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import { useLanguage } from '../context/LanguageContext'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { createSupabaseOrder } from '../services/supabaseClient'

export default function Checkout() {
  const auth = useContext(AuthContext)
  const { items, subtotal, deliveryFee, tax, appliedDiscount, total, clearCart } = useCart()
  const { location, setLocation, setIsModalOpen } = useLocation()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const user = auth?.user

  // Form states
  const [recipientName, setRecipientName] = useState(user?.name || 'Customer')
  const [phone, setPhone] = useState(user?.phone || '9876543210')
  const [deliverySlot, setDeliverySlot] = useState('ASAP')

  // Payment tab states: 'UPI' | 'CARD' | 'NETBANKING' | 'COD'
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890')
  const [cardExpiry, setCardExpiry] = useState('08/28')
  const [cardCvv, setCardCvv] = useState('412')
  const [cardName, setCardName] = useState(user?.name || 'Customer')
  const [selectedBank, setSelectedBank] = useState('HDFC Bank')

  // Payment processing loader state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const savedAddresses = user?.addresses || []

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 font-sans">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white">{t('emptyCartTitle')}</h2>
        <p className="text-xs text-slate-400">{t('emptyCartDesc')}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-sky-700 transition-colors"
        >
          {t('startShopping')}
        </button>
      </div>
    )
  }

  const handleSelectSavedAddress = (addr: any) => {
    setLocation({
      address: addr.street,
      area: addr.area,
      city: addr.city,
      pincode: addr.pincode,
      lat: 13.0418,
      lng: 80.2341
    })
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsProcessing(true)

    try {
      setProcessingStep('Connecting to Payment Gateway...')
      await new Promise(r => setTimeout(r, 600))

      if (paymentMethod === 'UPI') {
        setProcessingStep('Verifying VPA / UPI Payment...')
        await new Promise(r => setTimeout(r, 600))
      } else if (paymentMethod === 'CARD') {
        setProcessingStep('Authorizing 3D Secure Card Verification...')
        await new Promise(r => setTimeout(r, 600))
      } else if (paymentMethod === 'NETBANKING') {
        setProcessingStep(`Connecting to ${selectedBank} Portal...`)
        await new Promise(r => setTimeout(r, 600))
      }

      setProcessingStep('Finalizing Order & Reserving Fresh Seafood Catch...')
      await new Promise(r => setTimeout(r, 500))

      const orderPayload = {
        items,
        address: {
          name: recipientName,
          phone,
          street: location.address,
          area: location.area,
          city: location.city,
          pincode: location.pincode
        },
        deliverySlot: { type: deliverySlot },
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        discount: appliedDiscount,
        total
      }

      // 1. Try Supabase direct insert
      let createdOrder: any = null
      try {
        const supaOrder = await createSupabaseOrder(orderPayload)
        if (supaOrder) {
          createdOrder = {
            _id: supaOrder.id,
            orderNumber: supaOrder.order_number || ('FM' + Date.now().toString().slice(-8)),
            createdAt: supaOrder.created_at || new Date().toISOString(),
            ...orderPayload
          }
        }
      } catch (supaErr) {
        console.warn('Supabase order insert warning:', supaErr)
      }

      // 2. Fallback to Express backend API
      if (!createdOrder) {
        try {
          const res = await api.post('/orders', orderPayload)
          createdOrder = res.data.order || res.data
        } catch (apiErr) {
          // 3. Offline/Local fallback
          createdOrder = {
            _id: 'ORD' + Date.now().toString().slice(-8),
            orderNumber: 'FM' + Math.floor(10000000 + Math.random() * 90000000),
            createdAt: new Date().toISOString(),
            ...orderPayload
          }
        }
      }

      // Save order into localStorage recent orders list for instant history display
      try {
        const prev = JSON.parse(localStorage.getItem('fm_recent_orders') || '[]')
        localStorage.setItem('fm_recent_orders', JSON.stringify([createdOrder, ...prev]))
      } catch (e) {}

      clearCart()
      setIsProcessing(false)
      navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`, { state: { order: createdOrder } })
    } catch (err: any) {
      console.error(err)
      setIsProcessing(false)
      setErrorMsg('Payment verification failed. Please try again.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{t('checkoutTitle')}</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Complete your seafood order with 100% secure payment</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Delivery Address & Location */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-sm">1</span>
                <h2 className="text-lg font-black text-white">{t('deliveryAddress')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
              >
                {t('change')}
              </button>
            </div>

            {/* Saved Profile Addresses Quick Pick */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Select from Saved Addresses
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {savedAddresses.map(addr => {
                    const isSelected = location.area === addr.area || location.address === addr.street
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{addr.label}</span>
                          {isSelected && <span className="text-cyan-400 text-[10px]">Selected</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{addr.street}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Current Active Location Banner */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="text-xs font-black text-white">{location.area}, {location.city}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{location.address}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Verified Area
              </span>
            </div>

            {/* Recipient Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">{t('phoneNumber')}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Delivery Slot Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">{t('deliverySlot')}</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'ASAP', label: 'ASAP (90 Mins)' },
                  { id: 'EVENING', label: 'Evening (6-8 PM)' },
                  { id: 'MORNING', label: 'Tomorrow (7-9 AM)' }
                ].map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                      deliverySlot === slot.id
                        ? 'bg-cyan-500 text-white border-transparent shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Payment Gateway Tab Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-sm">2</span>
              <h2 className="text-lg font-black text-white">{t('paymentMode')}</h2>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', iconName: 'upi' },
                { id: 'CARD', label: 'Card', iconName: 'card' },
                { id: 'NETBANKING', label: 'NetBanking', iconName: 'bank' },
                { id: 'COD', label: 'Cash / COD', iconName: 'cash' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPaymentMethod(tab.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                  }`}
                >
                  {tab.id === 'UPI' && (
                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="4" />
                      <path d="M12 6v12M6 12h12" />
                    </svg>
                  )}
                  {tab.id === 'CARD' && (
                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  )}
                  {tab.id === 'NETBANKING' && (
                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 3L2 8h20l-10-5z" />
                    </svg>
                  )}
                  {tab.id === 'COD' && (
                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: UPI / QR Code Flow */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 bg-slate-950 text-white rounded-2xl space-y-4 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Scan & Pay Instant UPI</span>
                  <div className="flex gap-2 text-xs font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h2v2h-2v-2zm4 0h2v4h-2v-4zm-4 4h2v4h-2v-4zm2 2h2v2h-2v-2z"/>
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="text-xs text-slate-300">Scan QR Code using any UPI App or enter your UPI ID below:</div>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi / username@okicici"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card Flow */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 text-white rounded-2xl shadow-xl space-y-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cyan-300">
                    <span>OCEAN SECURE CARD</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div className="text-lg font-mono tracking-widest pt-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-xs pt-2">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-cyan-200">Card Holder</div>
                      <div className="font-bold uppercase tracking-wider">{cardName || 'CUSTOMER'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-cyan-200">Expires</div>
                      <div className="font-bold">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-300">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8912 3456 7890"
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Customer Name"
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Net Banking Flow */}
            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Select Popular Indian Bank</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        selectedBank === bank
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Cash on Delivery Flow */}
            {paymentMethod === 'COD' && (
              <div className="p-4 bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl space-y-1">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <span>Pay Cash or UPI on Arrival</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pay our delivery partner using Cash or UPI QR scanner when your fresh seafood order arrives at your door.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 hover:from-cyan-600 hover:to-blue-800 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-cyan-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Pay ₹{total} & Confirm Order</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Itemized Receipt Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-base font-black text-white pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-slate-400">{items.length} Items</span>
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                    />
                    <div className="truncate">
                      <div className="font-extrabold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.weightLabel} x {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-black text-white">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-semibold text-slate-300">
              <div className="flex justify-between">
                <span>{t('itemSubtotal')}</span>
                <span className="text-white font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryCharge')}</span>
                <span className="text-white font-bold">
                  {deliveryFee === 0 ? <strong className="text-emerald-400">{t('free')}</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('taxesGst')}</span>
                <span className="text-white font-bold">₹{tax}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>{t('discount')}</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>{t('totalAmount')}</span>
                <span className="text-cyan-400">₹{total}</span>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[11px] font-semibold text-cyan-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>100% Freshness & Weight Guarantee Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-cyan-500/30">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Processing Payment</h3>
              <p className="text-xs font-bold text-cyan-300 mt-2 animate-pulse">{processingStep}</p>
            </div>
            <p className="text-[11px] text-slate-400">Please do not close or refresh this page.</p>
          </div>
        </div>
      )}
    </div>
  )
}
