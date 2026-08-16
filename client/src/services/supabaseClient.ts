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

// Fallback dummy key to prevent initialization crash
const safeAnonKey = isSupabaseConfigured()
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export const supabase = createClient(supabaseUrl, safeAnonKey)

/**
 * Supabase Authentication Helper: Sign Up Customer
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
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase product fetch error:', error.message)
    return []
  }
  return data || []
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
