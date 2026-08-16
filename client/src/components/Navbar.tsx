import React, { useContext } from 'react'
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useLocation } from '../context/LocationContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import BrandLogo from './BrandLogo'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()
  const { location, setIsModalOpen } = useLocation()
  const { totalItemsCount, setIsCartDrawerOpen } = useCart()
  const { t } = useLanguage()

  const isAuthPage = routerLocation.pathname === '/login' || routerLocation.pathname === '/register'
  const isLoggedIn = Boolean(auth?.user)

  const handleLogout = () => {
    auth?.logout()
    navigate('/login')
  }

  // Minimal Clean Header for Login & Register pages
  if (isAuthPage) {
    return (
      <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-cyan-500/20 shadow-xl text-white font-sans py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="lg" />
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="text-xs font-bold uppercase tracking-wider">
              {routerLocation.pathname === '/login' ? (
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  {t('createAccount')} →
                </Link>
              ) : (
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  {t('signIn')} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Full Header for Customer Store Pages
  return (
    <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-cyan-500/20 shadow-xl text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Location Selector */}
        <div className="flex items-center gap-4 sm:gap-5">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>

          {/* Changeable Delivery Location Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all group"
          >
            <svg className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="text-left truncate max-w-[170px]">
              <div className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider">{t('deliveringTo')}</div>
              <div className="truncate font-extrabold text-white">{location.area}, {location.city}</div>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{t('change')}</span>
          </button>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-2.5 sm:gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Store Catalog Link */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>{t('catalog')}</span>
          </Link>

          {/* Orders History Link (Only for Logged In Customer) */}
          {isLoggedIn && (
            <Link
              to="/orders"
              className={`hidden sm:flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all ${
                routerLocation.pathname === '/orders'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{t('orders')}</span>
            </Link>
          )}

          {/* Cart Icon & Count Badge */}
          {isLoggedIn && (
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 text-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">{t('cart')}</span>
              {totalItemsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile & Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* Profile Link Button */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold text-cyan-200 transition-colors"
                title="View & Edit Profile"
              >
                {auth?.user?.photo ? (
                  <img src={auth.user.photo} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-cyan-400" />
                ) : (
                  <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                <span className="hidden lg:inline font-extrabold text-white max-w-[100px] truncate">{auth?.user?.name}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider transition-colors px-1.5 sm:px-2"
                title="Logout"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-sky-700 transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
            >
              {t('signIn')}
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Location & Orders Bar */}
      <div className="sm:hidden bg-slate-950/80 px-4 py-2 border-t border-cyan-500/10 flex items-center justify-between text-xs">
        <div className="truncate text-slate-300 font-medium flex items-center gap-1.5">
          <svg className="w-3 h-3 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate"><strong className="text-white">{location.area}</strong>, {location.city}</span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <Link to="/orders" className="text-cyan-300 font-bold">{t('orders')}</Link>
          )}
          <button onClick={() => setIsModalOpen(true)} className="text-cyan-400 font-bold">{t('change')}</button>
        </div>
      </div>
    </header>
  )
}
