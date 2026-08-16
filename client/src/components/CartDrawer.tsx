import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    couponCode,
    appliedDiscount,
    applyCoupon,
    removeCoupon,
    subtotal,
    deliveryFee,
    tax,
    total
  } = useCart()

  const { t } = useLanguage()
  const navigate = useNavigate()
  const [inputCoupon, setInputCoupon] = useState('')
  const [couponMsg, setCouponMsg] = useState<{ success?: boolean; text?: string }>({})

  if (!isCartDrawerOpen) return null

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCoupon) return
    const res = applyCoupon(inputCoupon)
    setCouponMsg({ success: res.success, text: res.message })
  }

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false)
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-cyan-100">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">{t('yourCart')}</h2>
                <p className="text-xs text-cyan-200">{items.length} unique items</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{t('emptyCartTitle')}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {t('emptyCartDesc')}
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-5 py-2.5 bg-cyan-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-cyan-600 transition-colors shadow-md shadow-cyan-500/20"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 hover:border-cyan-200 transition-colors">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-black text-slate-900 leading-tight">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors p-0.5"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md inline-block">
                      {item.weightLabel} | {item.cutting}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-sm font-black text-slate-900">
                        ₹{item.price * item.quantity}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-extrabold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('couponPlaceholder')}
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold uppercase text-slate-900 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-slate-800 transition-colors"
                  >
                    {t('applyCoupon')}
                  </button>
                </div>
                {couponMsg.text && (
                  <p className={`text-[11px] font-semibold ${couponMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
                {couponCode && (
                  <div className="flex items-center justify-between text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg">
                    <span>Applied: {couponCode} (-₹{appliedDiscount})</span>
                    <button type="button" onClick={removeCoupon} className="text-rose-600 font-bold hover:underline">Remove</button>
                  </div>
                )}
              </form>

              {/* Price Summary */}
              <div className="space-y-1.5 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>{t('itemSubtotal')}</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('deliveryCharge')}</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">{t('free')}</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('taxesGst')}</span>
                  <span className="font-bold text-slate-900">₹{tax}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{t('discount')}</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('totalAmount')}</span>
                  <span className="text-cyan-700">₹{total}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 hover:from-cyan-600 hover:to-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t('proceedToCheckout')}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
