import { Request, Response } from 'express'
import Order from '../models/Order'
import Cart from '../models/Cart'
import Product from '../models/Product'

function generateOrderNumber() {
  return 'FM' + Date.now().toString().slice(-8)
}

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const cart = await Cart.findOne({ user: userId })
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' })

  // Calculate subtotal and check stock
  let subtotal = 0
  for (const item of cart.items) {
    const product = await Product.findById(item.product)
    if (!product) return res.status(400).json({ message: `Product ${item.name} not found` })
    if (item.quantity > product.stock) return res.status(400).json({ message: `Insufficient stock for ${item.name}` })
    subtotal += item.price * item.quantity
  }

  const MIN_ORDER = Number(process.env.MIN_ORDER || 199)
  const DELIVERY_FEE = Number(process.env.DELIVERY_FEE || 40)
  const FREE_ABOVE = Number(process.env.FREE_DELIVERY_ABOVE || 499)

  if (subtotal < MIN_ORDER) return res.status(400).json({ message: `Minimum order value is ₹${MIN_ORDER}` })

  const deliveryFee = subtotal >= FREE_ABOVE ? 0 : DELIVERY_FEE
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: userId,
    items: cart.items,
    address: req.body.address || {},
    deliverySlot: req.body.deliverySlot || { type: 'ASAP' },
    paymentMethod: req.body.paymentMethod || 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'PLACED',
    subtotal,
    discount: 0,
    deliveryFee,
    tax,
    total
  })

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
  }

  // Clear cart
  ;(cart.items as any) = []
  await cart.save()

  return res.json({ order })
}

export const getOrders = async (req: Request, res: Response) => {
  const user = (req as any).user
  if (user.role === 'ADMIN') {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200)
    return res.json(orders)
  }
  const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 })
  return res.json(orders)
}

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await Order.findById(id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  return res.json(order)
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['PLACED','CONFIRMED','PREPARING','PACKED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })
  const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  return res.json(order)
}
