import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LocationModal from './components/LocationModal'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <div className="min-h-screen bg-[#070F1E] text-slate-100 font-sans flex flex-col justify-between">
              <div>
                <Navbar />
                <LocationModal />
                <CartDrawer />
                <main className="p-4 sm:p-6 max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  </Routes>
                </main>
              </div>

              {/* Clean Footer (No Emojis) */}
              <footer className="bg-slate-900 border-t border-cyan-500/20 py-8 px-4 text-center text-xs text-slate-400">
                <div className="max-w-6xl mx-auto space-y-3">
                  <div className="flex items-center justify-center gap-2 text-base font-black text-cyan-400">
                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6z" />
                      <path d="M18 12h.01" />
                      <path d="M2 10l4.5 2L2 14" />
                    </svg>
                    <span>FISH MART</span>
                  </div>
                  <p className="text-slate-400">
                    Fresh Catch. Fast Delivery. Cleaned, Gutted & Descaled • 100% Chemical-Free & Temperature Controlled 0-4°C
                  </p>
                  <div className="text-[11px] text-slate-500">
                    © 2026 Fish Mart Inc. All rights reserved. Express 90-Min Delivery across major cities.
                  </div>
                </div>
              </footer>
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}