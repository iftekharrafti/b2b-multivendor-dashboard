"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, User, MapPin, CreditCard, CheckCircle, Clock, Download, MessageCircle } from "lucide-react"

const OrderDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock order data
        const mockOrder = {
          id: id,
          customerName: "ABC Construction Co.",
          customerEmail: "orders@abcconstruction.com",
          customerPhone: "+1 (555) 123-4567",
          status: "processing",
          paymentStatus: "paid",
          paymentMethod: "Credit Card (**** 4242)",
          total: 1250.99,
          subtotal: 1150.99,
          tax: 100.0,
          shipping: 0.0,
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-20T14:15:00Z",
          shippingAddress: {
            name: "ABC Construction Co.",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
          },
          billingAddress: {
            name: "ABC Construction Co.",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
          },
          items: [
            {
              id: 1,
              name: "Industrial Steel Pipes",
              sku: "ISP-001",
              quantity: 10,
              price: 125.99,
              total: 1259.9,
              image: "/placeholder.svg?height=80&width=80",
            },
            {
              id: 2,
              name: "Heavy Duty Bolts Set",
              sku: "HDB-002",
              quantity: 2,
              price: 45.5,
              total: 91.0,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          timeline: [
            {
              status: "Order Placed",
              date: "2024-01-20T10:30:00Z",
              description: "Order has been placed successfully",
              completed: true,
            },
            {
              status: "Payment Confirmed",
              date: "2024-01-20T10:35:00Z",
              description: "Payment has been processed",
              completed: true,
            },
            {
              status: "Processing",
              date: "2024-01-20T14:15:00Z",
              description: "Order is being prepared for shipment",
              completed: true,
            },
            {
              status: "Shipped",
              date: null,
              description: "Order has been shipped",
              completed: false,
            },
            {
              status: "Delivered",
              date: null,
              description: "Order has been delivered",
              completed: false,
            },
          ],
          trackingNumber: null,
          notes: "Customer requested expedited processing. Handle with care.",
        }

        setOrder(mockOrder)
      } catch (error) {
        console.error("Error loading order:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800", label: "Processing" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Pending"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const updateOrderStatus = async (newStatus) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setOrder((prev) => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <p className="text-gray-600 mt-2">The order you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/orders")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(order.status)}
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Invoice
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        event.completed ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}>
                        {event.status}
                      </h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerEmail}</p>
                  <p className="text-sm text-gray-500">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {order.status === "shipped" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tracking number"
                    value={order.trackingNumber || ""}
                    onChange={(e) => setOrder((prev) => ({ ...prev, trackingNumber: e.target.value }))}
                  />
                </div>
              )}

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Update Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
