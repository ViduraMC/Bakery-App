'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Plus, Edit, Trash2, Package, Users, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  category: string
  image_url: string
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [loginTime, setLoginTime] = useState<string | null>(null)
  const [logoutTime, setLogoutTime] = useState<string | null>(null)
  const router = useRouter()

  const API_BASE = 'http://localhost:3001/api'

  useEffect(() => {
    // Auth check (robust)
    const checkAuth = () => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
    console.log('Dashboard - Retrieved role from localStorage:', role) // Debug log
    if (!role) {
        router.replace('/')
        return false
    }
    const isAdminUser = role === 'admin'
    console.log('Dashboard - Is admin?', isAdminUser) // Debug log
    setIsAdmin(isAdminUser)
      return true
    }
    if (!checkAuth()) return
    fetchProducts()
    fetchOrders()
    setLoading(false)
    // Track login time
    let loginTimestamp = localStorage.getItem('loginTime')
    if (!loginTimestamp) {
      loginTimestamp = new Date().toLocaleString()
      localStorage.setItem('loginTime', loginTimestamp)
    }
    setLoginTime(loginTimestamp)
    setLogoutTime(localStorage.getItem('logoutTime'))
    // Listen for logout event (in case of multi-tab)
    const onLogout = () => router.replace('/')
    window.addEventListener('logout', onLogout)
    return () => window.removeEventListener('logout', onLogout)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`)
      setProducts(response.data)
    } catch (error) {
      toast.error('Failed to fetch products')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders`)
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    }
  }

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      toast.error('Product is out of stock!')
      return
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    toast.success('Added to cart!')
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast.error('Please fill in customer information')
      return
    }
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: getCartTotal()
      }
      await axios.post(`${API_BASE}/orders`, orderData)
      toast.success('Order placed successfully!')
      setCart([])
      setShowCheckout(false)
      setCustomerInfo({ name: '', email: '' })
      fetchProducts()
      fetchOrders()
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await axios.post(`${API_BASE}/products`, productData)
      toast.success('Product added successfully!')
      setShowAddModal(false)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to add product')
    }
  }

  const handleEditProduct = async (productData: Product) => {
    try {
      await axios.put(`${API_BASE}/products/${productData.id}`, productData)
      toast.success('Product updated successfully!')
      setShowEditModal(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await axios.delete(`${API_BASE}/products/${productId}`)
      toast.success('Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`${API_BASE}/orders/${orderId}/status`, { status })
      toast.success('Order status updated!')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.dispatchEvent(new Event('logout'))
    window.location.replace('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Sweet Delights Bakery</h1>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <span className="text-xs text-gray-500">Logged in as: <b>{isAdmin ? 'Admin' : 'User'}</b></span>
              {loginTime && <span className="text-xs text-gray-500">Login: {loginTime}</span>}
              {logoutTime && <span className="text-xs text-gray-500">Last Logout: {logoutTime}</span>}
              <div className="flex items-center space-x-2 mt-2">
                {!isAdmin && (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({cart.length})</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary-600 px-4 py-2 rounded font-bold shadow hover:bg-gray-100 border border-primary-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin ? (
          // Admin Dashboard
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">Rs.{orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Products Management */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Products Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={product.image_url || 'https://via.placeholder.com/40'}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setShowEditModal(true)
                            }}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Orders Management */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Orders Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{order.total_amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // Customer View
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Fresh Baked Goods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="card overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300x200'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-primary-600">Rs.{product.price}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.quantity <= 0}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        product.quantity > 0
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
          onEdit={handleEditProduct}
        />
      )}
      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
          getCartTotal={getCartTotal}
        />
      )}
    </div>
  )
}

// Modal Components
function AddProductModal({ onClose, onAdd }: { onClose: () => void; onAdd: (product: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image_url: ''
  })
  const categories = [
    'Bread',
    'Pastries',
    'Muffins',
    'Cookies',
    'Pies',
    'Cakes',
    'Other'
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    })
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={3}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="input-field"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="input-field"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="input-field"
          />
          <div className="flex space-x-3">
            <button type="submit" className="btn-primary flex-1">Add Product</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditProductModal({ product, onClose, onEdit }: { product: Product; onClose: () => void; onEdit: (product: Product) => void }) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    quantity: product.quantity.toString(),
    category: product.category,
    image_url: product.image_url
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEdit({
      ...product,
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    })
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={3}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="input-field"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="input-field"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field"
            required
          >
            <option value="" disabled>Select Category</option>
            {['Bread','Pastries','Muffins','Cookies','Pies','Cakes','Other'].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="input-field"
          />
          <div className="flex space-x-3">
            <button type="submit" className="btn-primary flex-1">Update Product</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CheckoutModal({ 
  cart, 
  onClose, 
  onCheckout, 
  customerInfo, 
  setCustomerInfo, 
  updateCartQuantity, 
  removeFromCart, 
  getCartTotal 
}: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Checkout</h3>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <button onClick={onClose} className="btn-primary mt-4">Continue Shopping</button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            {/* Cart Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {cart.map((item: any) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.image_url || 'https://via.placeholder.com/50'}
                        alt={item.product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                        <p className="text-sm text-gray-500">Rs.{item.product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>Rs.{getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex space-x-3">
              <button onClick={onCheckout} className="btn-primary flex-1">Place Order</button>
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 