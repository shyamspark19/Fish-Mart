import React, { useContext } from 'react'
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useLocation } from '../context/LocationContext'
import { useCart } from '../context/CartContext'
import BrandLogo from './BrandLogo'

export default function Navbar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()
  const { location, setIsModalOpen } = useLocation()
  const { totalItemsCount, setIsCartDrawerOpen } = useCart()

  const isAuthPage = routerLocation.pathname === '/login' || routerLocation.pathname === '/register'
  const isLoggedIn = Boolean(auth?.user)
  const isAdmin = auth?.user?.role === 'ADMIN'

  const handleLogout = () => {
    auth?.logout()
    navigate('/login')
  }

  // Minimal Clean Header for Login & Register pages (No location, No catalog)
  if (isAuthPage) {
    return (
      <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-cyan-500/20 shadow-xl text-white font-sans py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="lg" />
          </Link>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            {routerLocation.pathname === '/login' ? (
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Create Account →
              </Link>
            ) : (
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign In →
              </Link>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Full Header for Store & Admin Pages
  return (
    <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-cyan-500/20 shadow-xl text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Distinct Brand Logo & Location Selector */}
        <div className="flex items-center gap-5">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>

          {/* Changeable Delivery Location Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all group"
          >
            <span className="text-cyan-400 text-sm group-hover:scale-110 transition-transform">📍</span>
            <div className="text-left truncate max-w-[170px]">
              <div className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider">Delivering to</div>
              <div className="truncate font-extrabold text-white">{location.area}, {location.city}</div>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">Change</span>
          </button>
        </div>

        {/* Right Navigation & Authenticated Cart */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {/* Admin Hub Link (Only for Admin users) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span>👑 Admin Hub</span>
            </Link>
          )}

          {/* Store Catalog Link */}
          <Link
            to="/"
            className="hidden md:block text-xs font-extrabold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Catalog
          </Link>

          {/* Cart Icon & Count Badge (ONLY SHOW FOR CUSTOMERS AFTER LOGIN) */}
          {isLoggedIn && !isAdmin && (
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 text-white"
            >
              <span className="text-sm">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>
          )}

          {/* User Auth Info & Logout Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-bold bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-cyan-200">
                {isAdmin ? '👑' : '👤'} {auth?.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider transition-colors px-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-sky-700 transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
              >
                Sign In / Select Role
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Location Bar */}
      <div className="sm:hidden bg-slate-950/80 px-4 py-2 border-t border-cyan-500/10 flex items-center justify-between text-xs">
        <div className="truncate text-slate-300 font-medium">
          📍 <strong className="text-white">{location.area}</strong>, {location.city}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="text-cyan-400 font-bold">Change</button>
      </div>
    </header>
  )
}
