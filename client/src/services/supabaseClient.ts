import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zubxrgefekxlossvqdxj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_G7aTVQe4JqhnzUnAWwI-2g_2CtjgYFM'

/**
 * Checks if a valid Supabase Anon/Publishable Key (sb_publishable_... or eyJ...) is provided.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    (supabaseAnonKey.startsWith('sb_publishable_') || supabaseAnonKey.startsWith('ey'))
  )
}

// Use provided key or fallback dummy key to prevent initialization crash
const safeAnonKey = isSupabaseConfigured() 
  ? supabaseAnonKey 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export const supabase = createClient(supabaseUrl, safeAnonKey)

/**
 * Supabase Authentication Helper: Sign Up User with Role
 */
export async function supabaseSignUp(email: string, password: string, name: string, role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase publishable key is missing. Please set VITE_SUPABASE_ANON_KEY in client/.env')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  })

  if (error) throw error
  return data
}

/**
 * Supabase Authentication Helper: Sign In User
 */
export async function supabaseSignIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase publishable key is missing. Please set VITE_SUPABASE_ANON_KEY in client/.env')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

/**
 * Supabase Database Helper: Fetch All Seafood Products
 */
export async function fetchSupabaseProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.warn('Supabase product fetch warning:', error.message)
    return null
  }
  return data
}

/**
 * Supabase Database Helper: Insert Customer Order
 */
export async function createSupabaseOrder(orderPayload: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        recipient_name: orderPayload.address?.name,
        phone: orderPayload.address?.phone,
        address: `${orderPayload.address?.street}, ${orderPayload.address?.area}, ${orderPayload.address?.city}`,
        delivery_slot: orderPayload.deliverySlot?.type,
        payment_method: orderPayload.paymentMethod,
        subtotal: orderPayload.subtotal,
        tax: orderPayload.tax,
        delivery_fee: orderPayload.deliveryFee,
        discount: orderPayload.discount,
        total: orderPayload.total,
        items: orderPayload.items,
        status: 'PLACED'
      }
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

/**
 * Supabase Database Helper: Fetch All Orders for Admin
 */
export async function fetchSupabaseOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase orders fetch warning:', error.message)
    return []
  }
  return data || []
}

/**
 * Supabase Database Helper: Update Order Status
 */
export async function updateSupabaseOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()

  if (error) {
    console.warn('Supabase order status update warning:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Create Product
 */
export async function createSupabaseProduct(payload: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: payload.name,
        description: payload.description,
        category: payload.category,
        images: payload.images || [],
        weights: payload.weights || [],
        cutting_options: payload.cuttingOptions || [],
        stock: payload.stock || 50,
        badge: payload.badge,
        net_weight: payload.netWeight,
        gross_weight: payload.grossWeight,
        pieces: payload.pieces,
        delivery_time: payload.deliveryTime || 'Today in 90 mins',
        is_active: true
      }
    ])
    .select()

  if (error) {
    console.warn('Supabase product creation warning:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Edit Product
 */
export async function updateSupabaseProduct(productId: string, payload: any) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: payload.name,
      description: payload.description,
      category: payload.category,
      images: payload.images || [],
      weights: payload.weights || [],
      cutting_options: payload.cuttingOptions || [],
      stock: payload.stock,
      badge: payload.badge,
      net_weight: payload.netWeight,
      gross_weight: payload.grossWeight,
      pieces: payload.pieces
    })
    .eq('id', productId)
    .select()

  if (error) {
    console.warn('Supabase product update warning:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Update Stock
 */
export async function updateSupabaseProductStock(productId: string, newStock: number) {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .select()

  if (error) {
    console.warn('Supabase stock update warning:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Delete Product (Soft delete)
 */
export async function deleteSupabaseProduct(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', productId)
    .select()

  if (error) {
    console.warn('Supabase product delete warning:', error.message)
    throw error
  }
  return data?.[0]
}
