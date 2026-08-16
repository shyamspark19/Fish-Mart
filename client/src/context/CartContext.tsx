import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string // unique id based on productId + weight + cutting
  productId: string
  name: string
  category: string
  weightLabel: string
  cutting: string
  price: number
  quantity: number
  image?: string
  netWeight?: string
  grossWeight?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any, weightLabel: string, cutting: string, price: number) => void
  updateQuantity: (id: string, delta: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  isCartDrawerOpen: boolean
  setIsCartDrawerOpen: (open: boolean) => void
  couponCode: string
  appliedDiscount: number
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  totalItemsCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ocean_cart_items')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        return []
      }
    }
    return []
  })

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  useEffect(() => {
    localStorage.setItem('ocean_cart_items', JSON.stringify(Array.isArray(items) ? items : []))
  }, [items])

  const addToCart = (product: any, weightLabel: string, cutting: string, price: number) => {
    const itemId = `${product._id}_${weightLabel}_${cutting}`
    setItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : []
      const existing = safePrev.find(item => item.id === itemId)
      if (existing) {
        return safePrev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product._id,
          name: product.name,
          category: product.category,
          weightLabel,
          cutting: cutting || product.cuttingOptions?.[0] || 'Standard Cut',
          price,
          quantity: 1,
          image: product.images?.[0],
          netWeight: product.netWeight,
          grossWeight: product.grossWeight
        }
        return [...safePrev, newItem]
      }
    })
    setIsCartDrawerOpen(true)
  }

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      (Array.isArray(prev) ? prev : [])
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (id: string) => {
    setItems(prev => (Array.isArray(prev) ? prev : []).filter(item => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
    setCouponCode('')
    setAppliedDiscount(0)
  }

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase()
    if (clean === 'OCEAN100') {
      setCouponCode('OCEAN100')
      setAppliedDiscount(100)
      return { success: true, message: 'OCEAN100 applied! ₹100 Discount added.' }
    } else if (clean === 'FRESH50') {
      setCouponCode('FRESH50')
      setAppliedDiscount(50)
      return { success: true, message: 'FRESH50 applied! ₹50 Discount added.' }
    }
    return { success: false, message: 'Invalid Coupon Code. Try OCEAN100 or FRESH50' }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setAppliedDiscount(0)
  }

  const safeItems = Array.isArray(items) ? items : []
  const subtotal = safeItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0)
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40
  const tax = Math.round(subtotal * 0.05)
  const rawTotal = subtotal + deliveryFee + tax - appliedDiscount
  const total = Math.max(0, rawTotal)
  const totalItemsCount = safeItems.reduce((acc, i) => acc + (i.quantity || 1), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        couponCode,
        appliedDiscount,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        tax,
        total,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
