"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Trash2, CheckCircle, XCircle, Clock, Store, Mail, Phone } from "lucide-react"

const ManageVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const mockVendors = [
      {
        id: 1,
        name: "ABC Construction Co.",
        email: "admin@abcconstruction.com",
        phone: "+1 (555) 123-4567",
        status: "active",
        joinedDate: "2023-06-15",
        totalProducts: 45,
        totalOrders: 156,
        revenue: 125750.99,
        rating: 4.8,
        location: "New York, NY",
      },
      {
        id: 2,
        name: "XYZ Manufacturing",
        email: "contact@xyzmanuf.com",
        phone: "+1 (555) 234-5678",
        status: "pending",
        joinedDate: "2024-01-15",
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        rating: 0,
        location: "Chicago, IL",
      },
      {
        id: 3,
        name: "BuildRight Inc.",
        email: "info@buildright.com",
        phone: "+1 (555) 345-6789",
        status: "active",
        joinedDate: "2023-04-10",
        totalProducts: 78,
        totalOrders: 98,
        revenue: 87320.5,
        rating: 4.6,
        location: "Los Angeles, CA",
      },
      {
        id: 4,
        name: "Industrial Solutions LLC",
        email: "sales@indsol.com",
        phone: "+1 (555) 456-7890",
        status: "suspended",
        joinedDate: "2023-11-05",
        totalProducts: 23,
        totalOrders: 45,
        revenue: 32150.75,
        rating: 3.2,
        location: "Houston, TX",
      },
    ]

    setTimeout(() => {
      setVendors(mockVendors)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Active",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      suspended: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Suspended",
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && vendor.status === filterStatus
  })

  const handleStatusChange = (vendorId, newStatus) => {
    setVendors(vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor)))
  }

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v) => v.id !== vendorId))
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Vendors</h1>
        <p className="text-gray-600">Oversee and manage vendor accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Store className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.filter((v) => v.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.filter((v) => v.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {vendors.filter((v) => v.status === "suspended").length}
              </p>
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
                placeholder="Search vendors..."
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.location}</div>
                      <div className="text-sm text-gray-500">Joined {vendor.joinedDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.totalProducts}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${vendor.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vendor.rating > 0 ? (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No ratings</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(vendor.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={vendor.status}
                        onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                      <button onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default ManageVendors
