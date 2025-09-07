"use client"

import { useState, useEffect } from "react"
import { Users, Store, Package, DollarSign, TrendingUp, AlertTriangle, Activity, Shield } from "lucide-react"
import { statsAPI } from "../services/api"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await statsAPI.getAdminStats()
      setStats(response.data)
    } catch (error) {
      console.error("Error loading admin stats:", error)
      setError("Failed to load admin dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={loadAdminStats} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Try Again
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">No data available</h2>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalVendors}</p>
              <p className="text-sm text-green-600">{stats.overview.activeVendors} active</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalProducts?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overview.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats.overview.monthlyGrowth}% this month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System Status & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Health</span>
              <span className="text-sm font-medium text-green-600">98.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "98.5%" }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.overview.pendingVendors}</p>
            <p className="text-sm text-gray-600">Vendors need review</p>
            <button className="mt-3 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
              Review Now
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Security Status</h3>
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SSL Certificate</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Valid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firewall</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backups</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Up to date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h3>
          </div>
          <div className="p-6">
            {stats.topVendors && stats.topVendors.length > 0 ? (
              <div className="space-y-4">
                {stats.topVendors.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vendor.companyName}</p>
                        <p className="text-sm text-gray-500">{vendor.orderCount || 0} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(vendor.totalSales || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No vendor data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentActivity?.users && stats.recentActivity.users.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-gray-700">Recent Users</h4>
                  {stats.recentActivity.users.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          New {user.role} registration: {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {stats.recentActivity?.orders && stats.recentActivity.orders.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-gray-700 mt-4">Recent Orders</h4>
                  {stats.recentActivity.orders.slice(0, 3).map((order, index) => (
                    <div key={order.id} className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          New order #{order.orderNumber} from {order.Vendor?.companyName}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {stats.revenueChart && stats.revenueChart.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Platform Revenue (Last 12 Months)</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <div className="grid grid-cols-12 gap-1 h-full">
                {stats.revenueChart.map((month, index) => {
                  const maxRevenue = Math.max(...stats.revenueChart.map((m) => m.revenue))
                  const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0

                  return (
                    <div key={index} className="flex flex-col justify-end items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%`, minHeight: height > 0 ? "4px" : "0px" }}
                        title={`${formatCurrency(month.revenue)} in ${month.month}`}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                        {new Date(month.month + "-01").toLocaleDateString("en-US", { month: "short" })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
