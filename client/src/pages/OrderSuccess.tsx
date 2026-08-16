import React from 'react'
import { useLocation as useRouterLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function OrderSuccess() {
  const { state } = useRouterLocation()
  const navigate = useNavigate()
  const { orderId } = useParams()
  const { t } = useLanguage()

  const order = state?.order || {
    orderNumber: orderId || 'FM' + Math.floor(10000000 + Math.random() * 90000000),
    total: 749,
    address: { name: 'Customer', area: 'T. Nagar', city: 'Chennai' },
    paymentMethod: 'UPI'
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 font-sans">
      {/* Success Celebration Card */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-cyan-950 text-white rounded-3xl p-8 text-center space-y-4 shadow-2xl border border-cyan-500/30 relative overflow-hidden">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-400/30">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Order Placed Successfully!</h1>
          <p className="text-xs text-cyan-200 mt-1">Thank you for your order. Our team is prepping your fresh seafood catch.</p>
        </div>

        {/* Order Number & Delivery ETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 max-w-lg mx-auto">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
            <div className="text-[10px] text-cyan-300 font-bold uppercase">{t('orderNumber')}</div>
            <div className="text-sm font-mono font-black">{order.orderNumber || order._id}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
            <div className="text-[10px] text-cyan-300 font-bold uppercase">Estimated Delivery</div>
            <div className="text-sm font-bold text-amber-400">Within 90 Minutes</div>
          </div>
        </div>
      </div>

      {/* Order Status Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">Live Delivery Status</h3>
          <Link to="/orders" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline">
            {t('orders')} →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-white font-black flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">1</div>
            <div className="font-extrabold text-white">Placed</div>
            <div className="text-[10px] text-slate-400">Just Now</div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-black flex items-center justify-center mx-auto">2</div>
            <div className="font-bold text-slate-400">Confirmed</div>
            <div className="text-[10px] text-slate-500">In 5 Mins</div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-black flex items-center justify-center mx-auto">3</div>
            <div className="font-bold text-slate-400">Out for Delivery</div>
            <div className="text-[10px] text-slate-500">In 30 Mins</div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-black flex items-center justify-center mx-auto">4</div>
            <div className="font-bold text-slate-400">Delivered</div>
            <div className="text-[10px] text-slate-500">90 Mins</div>
          </div>
        </div>
      </div>

      {/* Address & Payment Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">{t('deliveryAddress')} & Billing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-300">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('deliveryAddress')}</div>
            <div className="font-bold text-white mt-1">{order.address?.name || 'Customer'}</div>
            <div>{order.address?.street || order.address?.area}, {order.address?.city || 'Chennai'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('paymentMode')} & Total</div>
            <div className="font-bold text-white mt-1">{order.paymentMethod || 'UPI Instant'}</div>
            <div className="text-base font-black text-cyan-400 mt-0.5">₹{order.total} Paid</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg text-center transition-transform active:scale-95"
        >
          {t('orderHistory')}
        </Link>
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg text-center transition-transform active:scale-95"
        >
          {t('browseCatalog')}
        </button>
      </div>
    </div>
  )
}
