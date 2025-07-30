"use client"

import { useState } from "react"
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("sales")
  const [dateRange, setDateRange] = useState("30d")

  const reportTypes = [
    { id: "sales", name: "Sales Report", icon: DollarSign },
    { id: "orders", name: "Orders Report", icon: ShoppingCart },
    { id: "customers", name: "Customer Report", icon: Users },
    { id: "inventory", name: "Inventory Report", icon: Package },
    { id: "analytics", name: "Analytics Report", icon: BarChart3 },
  ]

  const mockReportData = {
    sales: {
      title: "Sales Performance Report",
      summary: {
        totalRevenue: 125750.99,
        totalOrders: 156,
        averageOrderValue: 806.09,
        growth: 27.5,
      },
      data: [
        { period: "Week 1", revenue: 28500.25, orders: 35 },
        { period: "Week 2", revenue: 32100.5, orders: 42 },
        { period: "Week 3", revenue: 29800.75, orders: 38 },
        { period: "Week 4", revenue: 35349.49, orders: 41 },
      ],
    },
    orders: {
      title: "Order Analysis Report",
      summary: {
        totalOrders: 156,
        completedOrders: 142,
        pendingOrders: 8,
        cancelledOrders: 6,
      },
      data: [
        { status: "Completed", count: 142, percentage: 91.0 },
        { status: "Pending", count: 8, percentage: 5.1 },
        { status: "Cancelled", count: 6, percentage: 3.9 },
      ],
    },
  }

  const currentReport = mockReportData[selectedReport] || mockReportData.sales

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view business reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Types Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Types</h3>
            <nav className="space-y-2">
              {reportTypes.map((report) => {
                const Icon = report.icon
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedReport === report.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {report.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Report Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{currentReport.title}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {dateRange === "7d" && "Last 7 days"}
                  {dateRange === "30d" && "Last 30 days"}
                  {dateRange === "90d" && "Last 90 days"}
                  {dateRange === "1y" && "Last year"}
                </div>
              </div>
            </div>

            {/* Report Summary */}
            {selectedReport === "sales" && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Revenue</p>
                        <p className="text-2xl font-bold">${currentReport.summary.totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-200" />
                    </div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+{currentReport.summary.growth}% from last period</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Total Orders</p>
                        <p className="text-2xl font-bold">{currentReport.summary.totalOrders}</p>
                      </div>
                      <ShoppingCart className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Avg Order Value</p>
                        <p className="text-2xl font-bold">${currentReport.summary.averageOrderValue.toFixed(2)}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Growth Rate</p>
                        <p className="text-2xl font-bold">+{currentReport.summary.growth}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Sales Data Table */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Period
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Order Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentReport.data.map((row, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${row.revenue.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.orders}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${(row.revenue / row.orders).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Report */}
            {selectedReport === "orders" && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Completed Orders</p>
                        <p className="text-2xl font-bold text-green-900">{currentReport.summary.completedOrders}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Pending Orders</p>
                        <p className="text-2xl font-bold text-yellow-900">{currentReport.summary.pendingOrders}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Package className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Cancelled Orders</p>
                        <p className="text-2xl font-bold text-red-900">{currentReport.summary.cancelledOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Breakdown */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Breakdown</h3>
                  <div className="space-y-4">
                    {currentReport.data.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full mr-3 ${
                              item.status === "Completed"
                                ? "bg-green-500"
                                : item.status === "Pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <span className="font-medium text-gray-900">{item.status}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{item.count} orders</span>
                          <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other Report Types */}
            {!["sales", "orders"].includes(selectedReport) && (
              <div className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Report Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500">This report type is currently being developed.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
