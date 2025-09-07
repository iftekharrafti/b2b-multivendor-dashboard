"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Download } from "lucide-react"

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [analytics, setAnalytics] = useState({})

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockAnalytics = {
          revenue: {
            current: 125750.99,
            previous: 98450.75,
            change: 27.7,
          },
          orders: {
            current: 156,
            previous: 134,
            change: 16.4,
          },
          customers: {
            current: 89,
            previous: 76,
            change: 17.1,
          },
          products: {
            current: 245,
            previous: 238,
            change: 2.9,
          },
          topProducts: [
            { name: "Industrial Steel Pipes", sales: 45, revenue: 5675.55 },
            { name: "Safety Equipment Kit", sales: 32, revenue: 5016.0 },
            { name: "Heavy Duty Bolts Set", sales: 28, revenue: 1274.0 },
            { name: "Electrical Wire Bundle", sales: 22, revenue: 5148.0 },
            { name: "Commercial Grade Cement", sales: 19, revenue: 1709.81 },
          ],
          recentOrders: [
            { id: "ORD-156", customer: "ABC Construction", amount: 1250.99, status: "completed" },
            { id: "ORD-155", customer: "XYZ Manufacturing", amount: 450.5, status: "processing" },
            { id: "ORD-154", customer: "BuildRight Inc.", amount: 2100.75, status: "shipped" },
            { id: "ORD-153", customer: "Metro Construction", amount: 875.25, status: "completed" },
          ],
        }

        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount)
  }

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getChangeColor = (change) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue?.current || 0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getChangeIcon(analytics.revenue?.change || 0)}
            <span className={`ml-2 text-sm font-medium ${getChangeColor(analytics.revenue?.change || 0)}`}>
              {Math.abs(analytics.revenue?.change || 0).toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders?.current || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getChangeIcon(analytics.orders?.change || 0)}
            <span className={`ml-2 text-sm font-medium ${getChangeColor(analytics.orders?.change || 0)}`}>
              {Math.abs(analytics.orders?.change || 0).toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.customers?.current || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getChangeIcon(analytics.customers?.change || 0)}
            <span className={`ml-2 text-sm font-medium ${getChangeColor(analytics.customers?.change || 0)}`}>
              {Math.abs(analytics.customers?.change || 0).toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.products?.current || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getChangeIcon(analytics.products?.change || 0)}
            <span className={`ml-2 text-sm font-medium ${getChangeColor(analytics.products?.change || 0)}`}>
              {Math.abs(analytics.products?.change || 0).toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topProducts?.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.recentOrders?.map((order, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Revenue Chart</h3>
              <p className="mt-1 text-sm text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
