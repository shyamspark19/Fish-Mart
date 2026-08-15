import api from './api'

/**
 * Service functions for Admin operations (Stock adjustment, Order status updates, Product management)
 */

/**
 * Adjust or update product stock quantity
 * @param productId - ID of the target product
 * @param newStock - Updated stock quantity
 */
export const updateProductStock = async (productId: string, newStock: number) => {
  const res = await api.put(`/admin/products/${productId}`, { stock: newStock })
  return res.data
}

/**
 * Update the delivery & processing status of a customer order
 * @param orderId - ID of the order to update
 * @param status - Updated order status (e.g. 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED')
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await api.put(`/orders/${orderId}/status`, { status })
  return res.data
}

/**
 * Delete a product from inventory
 * @param productId - ID of product to delete
 */
export const deleteAdminProduct = async (productId: string) => {
  const res = await api.delete(`/admin/products/${productId}`)
  return res.data
}

/**
 * Create a new product in the catalog
 * @param payload - Product details payload
 */
export const createAdminProduct = async (payload: any) => {
  const res = await api.post('/admin/products', payload)
  return res.data
}

/**
 * Edit existing product details
 * @param productId - ID of product
 * @param payload - Updated fields
 */
export const editAdminProduct = async (productId: string, payload: any) => {
  const res = await api.put(`/admin/products/${productId}`, payload)
  return res.data
}
