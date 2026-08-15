import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zubxrgefekxlossvqdxj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_G7aTVQe4JqhnzUnAWwI-2g_2CtjgYFM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Supabase Authentication Helper: Sign Up User with Role
 */
export async function supabaseSignUp(email: string, password: string, name: string, role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') {
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
