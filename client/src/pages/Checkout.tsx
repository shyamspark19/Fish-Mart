import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import api from '../services/api'

export default function Checkout() {
  const { items, subtotal, deliveryFee, tax, appliedDiscount, total, clearCart } = useCart()
  const { location, setIsModalOpen } = useLocation()
  const navigate = useNavigate()

  // Form states
  const [recipientName, setRecipientName] = useState('John Doe')
  const [phone, setPhone] = useState('9876543210')
  const [deliverySlot, setDeliverySlot] = useState('ASAP')

  // Payment tab states: 'UPI' | 'CARD' | 'NETBANKING' | 'COD'
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890')
  const [cardExpiry, setCardExpiry] = useState('08/28')
  const [cardCvv, setCardCvv] = useState('412')
  const [cardName, setCardName] = useState('John Doe')
  const [selectedBank, setSelectedBank] = useState('HDFC')

  // Payment processing loader state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-600">Please add fresh fish or seafood to your cart before checking out.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-sky-700 transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    )
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsProcessing(true)

    try {
      // Simulate realistic payment gateway authorization stages
      setProcessingStep('Connecting to Secure Payment Gateway...')
      await new Promise(r => setTimeout(r, 800))

      if (paymentMethod === 'UPI') {
        setProcessingStep('Verifying VPA / UPI ID...')
        await new Promise(r => setTimeout(r, 700))
      } else if (paymentMethod === 'CARD') {
        setProcessingStep('Authorizing 3D Secure Card Verification...')
        await new Promise(r => setTimeout(r, 700))
      } else if (paymentMethod === 'NETBANKING') {
        setProcessingStep(`Connecting to ${selectedBank} NetBanking Portal...`)
        await new Promise(r => setTimeout(r, 700))
      }

      setProcessingStep('Finalizing Order & Reserving Fresh Seafood...')
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

      // Try sending order to backend API, or generate mock order if guest
      let createdOrder: any = null
      try {
        const res = await api.post('/orders', orderPayload)
        createdOrder = res.data.order || res.data
      } catch (err) {
        // Fallback for guest mode
        createdOrder = {
          _id: 'ORD' + Date.now().toString().slice(-8),
          orderNumber: 'FM' + Math.floor(10000000 + Math.random() * 90000000),
          createdAt: new Date().toISOString(),
          ...orderPayload
        }
      }

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
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Checkout & Payment</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Complete your order with 100% secure payment</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200">
          <span>🔒 256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Delivery Address & Location */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-sm">1</span>
                <h2 className="text-lg font-black text-slate-900">Delivery Address</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 underline"
              >
                Change Pin Location
              </button>
            </div>

            {/* Location Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-xs font-black text-slate-900">{location.area}, {location.city}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{location.address}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Verified Area
              </span>
            </div>

            {/* Recipient Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Delivery Slot Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Select Delivery Slot</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'ASAP', label: '⚡ ASAP (90 Mins)' },
                  { id: 'EVENING', label: '🌆 Evening (6-8 PM)' },
                  { id: 'MORNING', label: '🌅 Tomorrow (7-9 AM)' }
                ].map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                      deliverySlot === slot.id
                        ? 'bg-cyan-500 text-white border-transparent shadow-md shadow-cyan-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Payment Gateway Tab Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-sm">2</span>
              <h2 className="text-lg font-black text-slate-900">Payment Gateway</h2>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: '📱 UPI / QR', icon: '📲' },
                { id: 'CARD', label: '💳 Card', icon: '💳' },
                { id: 'NETBANKING', label: '🏦 NetBanking', icon: '🏦' },
                { id: 'COD', label: '💵 Cash/COD', icon: '💵' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPaymentMethod(tab.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: UPI / QR Code Flow */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Scan & Pay Instant UPI</span>
                  <div className="flex gap-2 text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                    {/* Simulated QR Code SVG */}
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h2v2h-2v-2zm4 0h2v4h-2v-4zm-4 4h2v4h-2v-4zm2 2h2v2h-2v-2z"/>
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="text-xs text-slate-300">Scan QR Code using any UPI App or enter your UPI VPA ID below:</div>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi / username@okicici"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card Flow */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-4">
                {/* Credit Card Graphic Preview */}
                <div className="p-5 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-900 text-white rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cyan-200">
                    <span>OCEAN DEBIT / CREDIT CARD</span>
                    <span className="text-lg">💳</span>
                  </div>
                  <div className="text-lg font-mono tracking-widest pt-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-xs pt-2">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-cyan-200">Card Holder</div>
                      <div className="font-bold uppercase tracking-wider">{cardName || 'JOHN DOE'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-cyan-200">Expires</div>
                      <div className="font-bold">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8912 3456 7890"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JOHN DOE"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Net Banking Flow */}
            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">Select Popular Indian Bank</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        selectedBank === bank
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-800 ring-2 ring-cyan-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      🏛️ {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Cash on Delivery Flow */}
            {paymentMethod === 'COD' && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl space-y-1">
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>💵 Pay Cash or UPI on Arrival</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Pay our delivery partner using Cash or UPI QR scanner when your fresh seafood order arrives at your door.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
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
              <span>⚡</span>
            </button>
          </div>
        </div>

        {/* Right Column: Itemized Receipt Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 sticky top-24">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-slate-500">{items.length} Items</span>
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="truncate">
                      <div className="font-extrabold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.weightLabel} x {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-black text-slate-900">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-900 font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-slate-900 font-bold">
                  {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Packing (5%)</span>
                <span className="text-slate-900 font-bold">₹{tax}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-cyan-700">₹{total}</span>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl text-[11px] font-semibold text-cyan-800 flex items-center gap-2">
              <span>🛡️</span>
              <span>100% Freshness & Weight Guarantee Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Gateway Processing Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-cyan-100">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl">💳</div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Processing Payment</h3>
              <p className="text-xs font-bold text-cyan-600 mt-2 animate-pulse">{processingStep}</p>
            </div>
            <p className="text-[11px] text-slate-400">Please do not close or refresh this page.</p>
          </div>
        </div>
      )}
    </div>
  )
}
