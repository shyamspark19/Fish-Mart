import React from 'react'
import { useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom'

export default function OrderSuccess() {
  const { state } = useRouterLocation()
  const navigate = useNavigate()
  const { orderId } = useParams()

  const order = state?.order || {
    orderNumber: orderId || 'FM' + Math.floor(10000000 + Math.random() * 90000000),
    total: 749,
    address: { name: 'John Doe', area: 'T. Nagar', city: 'Chennai' },
    paymentMethod: 'UPI'
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 font-sans">
      {/* Success Celebration Card */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-cyan-950 text-white rounded-3xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-400/30 animate-bounce">
          ✓
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            Payment Confirmed
          </span>
          <h1 className="text-3xl font-black tracking-tight">Order Placed Successfully!</h1>
          <p className="text-xs text-cyan-200 mt-1">Thank you for your order. Our team is prepping your fresh seafood catch.</p>
        </div>

        {/* Order Number & Delivery ETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 max-w-lg mx-auto">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
            <div className="text-[10px] text-cyan-300 font-bold uppercase">Order Reference</div>
            <div className="text-sm font-mono font-black">{order.orderNumber || order._id}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
            <div className="text-[10px] text-cyan-300 font-bold uppercase">Estimated Delivery</div>
            <div className="text-sm font-bold text-amber-400">⚡ Within 90 Minutes</div>
          </div>
        </div>
      </div>

      {/* Order Status Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Live Delivery Tracker</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-white font-black flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">1</div>
            <div className="font-extrabold text-slate-900">Placed</div>
            <div className="text-[10px] text-slate-400">Just Now</div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-black flex items-center justify-center mx-auto">2</div>
            <div className="font-bold text-slate-500">Confirmed</div>
            <div className="text-[10px] text-slate-400">In 5 Mins</div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-black flex items-center justify-center mx-auto">3</div>
            <div className="font-bold text-slate-500">Out for Delivery</div>
            <div className="text-[10px] text-slate-400">In 30 Mins</div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-black flex items-center justify-center mx-auto">4</div>
            <div className="font-bold text-slate-500">Delivered</div>
            <div className="text-[10px] text-slate-400">90 Mins</div>
          </div>
        </div>
      </div>

      {/* Address & Payment Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Delivery & Payment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Delivery Address</div>
            <div className="font-bold text-slate-900 mt-1">{order.address?.name || 'Customer'}</div>
            <div>{order.address?.street || order.address?.area}, {order.address?.city || 'Chennai'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Payment Mode & Total</div>
            <div className="font-bold text-slate-900 mt-1">{order.paymentMethod || 'UPI Instant'}</div>
            <div className="text-base font-black text-cyan-700 mt-0.5">₹{order.total} Paid</div>
          </div>
        </div>
      </div>

      {/* Return to Home CTA */}
      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95"
        >
          Back to Ocean Catalog
        </button>
      </div>
    </div>
  )
}
