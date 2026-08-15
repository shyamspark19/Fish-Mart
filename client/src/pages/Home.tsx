import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import { AuthContext } from '../context/AuthContext'

interface Product {
  _id: string
  name: string
  description: string
  category: string
  images: string[]
  weights: { label: string; price: number }[]
  cuttingOptions: string[]
  stock: number
  badge?: string
  netWeight?: string
  grossWeight?: string
  pieces?: string
  deliveryTime?: string
  rating?: number
  reviewsCount?: number
}

const BANNERS = [
  {
    id: 1,
    tag: '🐟 FRESH CATCH OF THE DAY',
    title: 'Seer Fish & White Pomfret',
    subtitle: 'Sourced daily from coastal boats. 100% Chemical-Free, descaled & temperature controlled.',
    cta: 'Shop Fresh Fish',
    bg: 'from-slate-950 via-sky-950 to-cyan-950',
    accentColor: 'text-cyan-400',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    tag: '✨ NEW ARRIVAL UPDATE',
    title: 'Jumbo Tiger Prawns & Mud Crabs',
    subtitle: 'Cleaned, deshelled & deveined. Ready to cook immediately for spicy roasts & curries.',
    cta: 'Explore Shellfish',
    bg: 'from-slate-950 via-indigo-950 to-blue-950',
    accentColor: 'text-amber-400',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    tag: '🎉 WEEKEND SPECIAL OFFER',
    title: 'Flat ₹100 OFF on Orders Above ₹499',
    subtitle: 'Use coupon code OCEAN100 at checkout. Fast 90-Minute delivery guaranteed.',
    cta: 'Claim Discount',
    bg: 'from-slate-950 via-cyan-950 to-emerald-950',
    accentColor: 'text-emerald-400',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  }
]

export default function Home() {
  const navigate = useNavigate()
  const auth = React.useContext(AuthContext)
  const isLoggedIn = Boolean(auth?.user)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'FEATURED' | 'LOW_HIGH' | 'HIGH_LOW' | 'RATING'>('FEATURED')

  const [selectedWeights, setSelectedWeights] = useState<{ [key: string]: number }>({})
  const [selectedCuts, setSelectedCuts] = useState<{ [key: string]: string }>({})

  // Carousel Banner State (Right to Left Slide)
  const [currentSlide, setCurrentSlide] = useState(0)

  const { addToCart, items } = useCart()
  const { location, setIsModalOpen } = useLocation()

  const categories = [
    'All',
    'Sea Fish',
    'Freshwater Fish',
    'Prawns & Shrimps',
    'Crabs & Shellfish',
    'Ready to Cook',
    'Combo Packs'
  ]

  // Banner Auto-Play Slider (Right to Left every 4s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BANNERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get('/products')
        setProducts(res.data)
      } catch (err: any) {
        console.error('Failed to load products:', err)
        setError('Failed to fetch seafood products from backend server.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const priceA = a.weights?.[0]?.price || 0
      const priceB = b.weights?.[0]?.price || 0
      if (sortBy === 'LOW_HIGH') return priceA - priceB
      if (sortBy === 'HIGH_LOW') return priceB - priceA
      if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0)
      return 0
    })

  const handleWeightChange = (productId: string, weightIndex: number) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weightIndex }))
  }

  const handleCutChange = (productId: string, cutOption: string) => {
    setSelectedCuts(prev => ({ ...prev, [productId]: cutOption }))
  }

  const handleAdd = (product: Product) => {
    if (!isLoggedIn) {
      alert('Please Sign In to add items to your cart.')
      navigate('/login')
      return
    }

    const weightIdx = selectedWeights[product._id] || 0
    const activeWeightObj = product.weights?.[weightIdx] || product.weights?.[0]
    const weightLabel = activeWeightObj?.label || '300g Pack'
    const price = activeWeightObj?.price || 299
    const cut = selectedCuts[product._id] || product.cuttingOptions?.[0] || 'Standard Cut'

    addToCart(product, weightLabel, cut, price)
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Dynamic Right-to-Left Sliding Banner Carousel */}
      <section className="relative rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-slate-950 h-[340px] sm:h-[300px]">
        <div className="relative w-full h-full overflow-hidden">
          {BANNERS.map((banner, idx) => {
            const isCurrent = idx === currentSlide
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out flex items-center justify-between p-6 sm:p-10 bg-gradient-to-r ${banner.bg} ${
                  isCurrent
                    ? 'translate-x-0 opacity-100 z-10'
                    : 'translate-x-full opacity-0 z-0'
                }`}
              >
                <div className="max-w-xl space-y-3 z-10">
                  <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-black uppercase tracking-wider border border-cyan-500/30">
                    {banner.tag}
                  </span>

                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {banner.title}
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                    {banner.subtitle}
                  </p>

                  <div className="pt-2 flex items-center gap-4">
                    <a
                      href="#catalog-grid"
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-transform active:scale-95"
                    >
                      {banner.cta}
                    </a>
                  </div>
                </div>

                {/* Banner Thumbnail Photo */}
                <div className="hidden md:block w-72 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel Slider Controls (Dots & Arrows) */}
        <div className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
          {/* Indicator Dots */}
          <div className="flex items-center gap-2">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((currentSlide - 1 + BANNERS.length) % BANNERS.length)}
              className="w-8 h-8 rounded-full bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center transition-colors"
            >
              ⟨
            </button>
            <button
              onClick={() => setCurrentSlide((currentSlide + 1) % BANNERS.length)}
              className="w-8 h-8 rounded-full bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center transition-colors"
            >
              ⟩
            </button>
          </div>
        </div>
      </section>

      {/* Search & Sorting Toolbar */}
      <section id="catalog-grid" className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search fresh fish, prawns, pomfret..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <label className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-xs font-extrabold text-cyan-300 rounded-xl p-2 focus:outline-none"
          >
            <option value="FEATURED">Featured Items</option>
            <option value="LOW_HIGH">Price: Low to High</option>
            <option value="HIGH_LOW">Price: High to Low</option>
            <option value="RATING">Top Customer Rating</option>
          </select>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-3 -mx-4 px-4 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Catalog Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {selectedCategory === 'All' ? 'Fish Mart Fresh Catalog' : selectedCategory}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Cleaned, descaled & temperature controlled 0–4°C</p>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full">
            {filteredProducts.length} Items Available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent"></div>
            <div className="mt-4 text-sm font-bold text-cyan-300">Fetching Fish Mart Catalog...</div>
          </div>
        ) : error ? (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
            No products match your search or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const weightIdx = selectedWeights[product._id] || 0
              const activeWeightObj = product.weights?.[weightIdx] || product.weights?.[0]
              const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'

              const cartCountForProduct = items
                .filter(i => i.productId === product._id)
                .reduce((acc, i) => acc + i.quantity, 0)

              return (
                <div
                  key={product._id}
                  className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-lg">
                        {product.badge}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/20 font-bold text-[10px] px-2.5 py-1 rounded-lg">
                      ⚡ {product.deliveryTime || 'Today in 90 mins'}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold text-cyan-400">{product.category}</span>
                        <div className="flex items-center gap-1 font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          <span>★ {product.rating || 4.8}</span>
                          <span className="text-slate-400 font-normal text-[10px]">({product.reviewsCount || 120})</span>
                        </div>
                      </div>

                      <h3 className="font-black text-white text-base leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Weight & Net Meat Specs */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                        <span>Net Wt: <strong className="text-white font-bold">{product.netWeight || '300g'}</strong></span>
                        <span>Gross Wt: {product.grossWeight || '450g'}</span>
                      </div>
                      {product.pieces && (
                        <div className="text-[10px] text-cyan-300/80 font-semibold">
                          Pack Size: {product.pieces}
                        </div>
                      )}
                    </div>

                    {/* Weight Selector */}
                    {product.weights && product.weights.length > 1 && (
                      <select
                        value={weightIdx}
                        onChange={(e) => handleWeightChange(product._id, Number(e.target.value))}
                        className="w-full text-xs font-bold bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        {product.weights.map((w, idx) => (
                          <option key={idx} value={idx}>
                            {w.label} - ₹{w.price}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Cut Preference Selector */}
                    {product.cuttingOptions && product.cuttingOptions.length > 0 && (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-extrabold text-slate-400">Cut Preference</label>
                        <select
                          value={selectedCuts[product._id] || product.cuttingOptions[0]}
                          onChange={(e) => handleCutChange(product._id, e.target.value)}
                          className="w-full text-[11px] font-semibold bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-cyan-200 focus:outline-none focus:border-cyan-500"
                        >
                          {product.cuttingOptions.map((cut, idx) => (
                            <option key={idx} value={cut}>{cut}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                      <div>
                        <div className="text-[9px] uppercase font-black text-slate-500">Price</div>
                        <div className="text-xl font-black text-white">
                          ₹{activeWeightObj?.price || 299}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAdd(product)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md ${
                          cartCountForProduct > 0
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white shadow-cyan-500/20 active:scale-95'
                        }`}
                      >
                        {cartCountForProduct > 0 ? `✓ Added (${cartCountForProduct})` : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
