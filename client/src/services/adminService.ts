import api from './api'
import {
  createSupabaseProduct,
  updateSupabaseProduct,
  updateSupabaseProductStock,
  deleteSupabaseProduct,
  updateSupabaseOrderStatus
} from './supabaseClient'

/**
 * Adjust or update product stock quantity
 */
export const updateProductStock = async (productId: string, newStock: number) => {
  try {
    const data = await updateSupabaseProductStock(productId, newStock)
    if (data) return data
  } catch (e) {}

  const res = await api.put(`/admin/products/${productId}`, { stock: newStock })
  return res.data
}

/**
 * Update the delivery & processing status of a customer order
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const data = await updateSupabaseOrderStatus(orderId, status)
    if (data) return data
  } catch (e) {}

  const res = await api.put(`/orders/${orderId}/status`, { status })
  return res.data
}

/**
 * Delete a product from inventory
 */
export const deleteAdminProduct = async (productId: string) => {
  try {
    const data = await deleteSupabaseProduct(productId)
    if (data) return data
  } catch (e) {}

  const res = await api.delete(`/admin/products/${productId}`)
  return res.data
}

/**
 * Create a new product in the catalog
 */
export const createAdminProduct = async (payload: any) => {
  try {
    const data = await createSupabaseProduct(payload)
    if (data) return data
  } catch (e) {}

  const res = await api.post('/admin/products', payload)
  return res.data
}

/**
 * Edit existing product details
 */
export const editAdminProduct = async (productId: string, payload: any) => {
  try {
    const data = await updateSupabaseProduct(productId, payload)
    if (data) return data
  } catch (e) {}

  const res = await api.put(`/admin/products/${productId}`, payload)
  return res.data
}
