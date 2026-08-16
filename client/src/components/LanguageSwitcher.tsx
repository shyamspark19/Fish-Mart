import React, { useState, useRef, useEffect } from 'react'
import { useLanguage, Language } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English (EN)' },
    { code: 'ta', label: 'Tamil', nativeName: 'தமிழ் (TA)' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिंदी (HI)' }
  ]

  const current = languages.find(l => l.code === language) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/50 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
        title="Change Language / மொழியை மாற்றவும் / भाषा बदलें"
      >
        {/* Clean Globe SVG Icon */}
        <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="uppercase text-[11px] font-extrabold tracking-wider">{current.code}</span>
        <svg className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 py-1 backdrop-blur-md">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Select Language
          </div>
          {languages.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                language === lang.code
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{lang.nativeName}</span>
              {language === lang.code && (
                <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
