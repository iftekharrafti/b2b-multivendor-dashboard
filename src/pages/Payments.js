"use client"

import { useState, useEffect } from "react"
import { CreditCard, DollarSign, TrendingUp, Calendar, Search, Filter, Download, Eye } from "lucide-react"

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const mockPayments = [
      {
        id: "PAY-001",
        orderId: "ORD-001",
        customer: "ABC Construction Co.",
        amount: 1250.99,
        method: "Credit Card",
        status: "completed",
        transactionId: "txn_1234567890",
        createdAt: "2024-01-20T10:30:00Z",
        processedAt: "2024-01-20T10:31:15Z",
      },
      {
        id: "PAY-002",
        orderId: "ORD-002",
        customer: "XYZ Manufacturing",
        amount: 450.5,
        method: "Bank Transfer",
        status: "pending",
        transactionId: "txn_1234567891",
        createdAt: "2024-01-19T14:15:00Z",
        processedAt: null,
      },
      {
        id: "PAY-003",
        orderId: "ORD-003",
        customer: "BuildRight Inc.",
        amount: 2100.75,
        method: "Credit Card",
        status: "completed",
        transactionId: "txn_1234567892",
        createdAt: "2024-01-18T09:45:00Z",
        processedAt: "2024-01-18T09:46:22Z",
      },
      {
        id: "PAY-004",
        orderId: "ORD-004",
        customer: "Metro Construction",
        amount: 875.25,
        method: "PayPal",
        status: "failed",
        transactionId: "txn_1234567893",
        createdAt: "2024-01-17T16:20:00Z",
        processedAt: "2024-01-17T16:21:05Z",
      },
      {
        id: "PAY-005",
        orderId: "ORD-005",
        customer: "Industrial Solutions LLC",
        amount: 1680.0,
        method: "Credit Card",
        status: "refunded",
        transactionId: "txn_1234567894",
        createdAt: "2024-01-16T11:10:00Z",
        processedAt: "2024-01-16T11:11:30Z",
      },
    ]

    setTimeout(() => {
      setPayments(mockPayments)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        color: "bg-green-100 text-green-800",
        label: "Completed",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
      },
      failed: {
        color: "bg-red-100 text-red-800",
        label: "Failed",
      },
      refunded: {
        color: "bg-gray-100 text-gray-800",
        label: "Refunded",
      },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && payment.status === filterStatus
  })

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentStats = () => {
    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0)
    const pendingAmount = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, payment) => sum + payment.amount, 0)
    const completedCount = payments.filter((p) => p.status === "completed").length
    const failedCount = payments.filter((p) => p.status === "failed").length

    return {
      totalRevenue,
      pendingAmount,
      completedCount,
      failedCount,
      totalTransactions: payments.length,
    }
  }

  const stats = getPaymentStats()

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
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track and manage payment transactions</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">${stats.pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                    <div className="text-sm text-gray-500">{payment.transactionId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(payment.createdAt)}</div>
                    {payment.processedAt && (
                      <div className="text-sm text-gray-500">Processed: {formatDate(payment.processedAt)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments
