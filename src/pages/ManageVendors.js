"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  AlertCircle,
  Building,
  Globe,
} from "lucide-react"
import { adminAPI } from "../services/api"

const ManageVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterApproved, setFilterApproved] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVendors, setTotalVendors] = useState(0)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [alert, setAlert] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    tradeLicense: "",
    nid: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    website: "",
    description: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const [approvalData, setApprovalData] = useState({
    isApproved: false,
    rejectionReason: "",
  })

  const [formErrors, setFormErrors] = useState({})

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(filterApproved !== "all" && { approved: filterApproved }),
        ...(filterStatus !== "all" && { status: filterStatus }),
      }

      const response = await adminAPI.getVendors(params)
      setVendors(response.data.vendors)
      setTotalPages(response.data.totalPages)
      setTotalVendors(response.data.total)
    } catch (error) {
      console.error("Error fetching vendors:", error)
      showAlert("Error fetching vendors", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [currentPage, searchTerm, filterApproved, filterStatus])

  // Show alert
  const showAlert = (message, type = "success") => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle approval data changes
  const handleApprovalChange = (e) => {
    const { name, value, type, checked } = e.target
    setApprovalData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formData.companyName.trim()) errors.companyName = "Company name is required"
    if (!formData.businessType.trim()) errors.businessType = "Business type is required"
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle edit vendor
  const handleEditVendor = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await adminAPI.updateVendor(selectedVendor.id, formData)
      showAlert("Vendor updated successfully")
      setShowEditModal(false)
      resetForm()
      fetchVendors()
    } catch (error) {
      const message = error.response?.data?.message || "Error updating vendor"
      showAlert(message, "error")
    }
  }

  // Handle delete vendor
  const handleDeleteVendor = async () => {
    try {
      await adminAPI.deleteVendor(selectedVendor.id)
      showAlert("Vendor deleted successfully")
      setShowDeleteModal(false)
      setSelectedVendor(null)
      fetchVendors()
    } catch (error) {
      const message = error.response?.data?.message || "Error deleting vendor"
      showAlert(message, "error")
    }
  }

  // Handle vendor approval
  const handleVendorApproval = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.approveVendor(selectedVendor.id, approvalData.isApproved, approvalData.rejectionReason)
      showAlert(`Vendor ${approvalData.isApproved ? "approved" : "rejected"} successfully`)
      setShowApprovalModal(false)
      setSelectedVendor(null)
      setApprovalData({ isApproved: false, rejectionReason: "" })
      fetchVendors()
    } catch (error) {
      const message = error.response?.data?.message || "Error updating vendor approval"
      showAlert(message, "error")
    }
  }

  // Handle status change
  const handleStatusChange = async (vendorId, newStatus) => {
    try {
      await adminAPI.updateVendorStatus(vendorId, newStatus)
      showAlert(`Vendor status updated to ${newStatus} successfully`)
      fetchVendors()
    } catch (error) {
      const message = error.response?.data?.message || "Error updating vendor status"
      showAlert(message, "error")
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      companyName: "",
      businessType: "",
      tradeLicense: "",
      nid: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      website: "",
      description: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    })
    setFormErrors({})
    setSelectedVendor(null)
  }

  // Open vendor details modal
  const openDetailsModal = async (vendor) => {
    try {
      const response = await adminAPI.getVendorById(vendor.id)
      setSelectedVendor(response.data.vendor)
      setShowDetailsModal(true)
    } catch (error) {
      showAlert("Error fetching vendor details", "error")
    }
  }

  // Open edit modal
  const openEditModal = (vendor) => {
    setSelectedVendor(vendor)
    setFormData({
      companyName: vendor.companyName || "",
      businessType: vendor.businessType || "",
      tradeLicense: vendor.tradeLicense || "",
      nid: vendor.nid || "",
      address: vendor.address || "",
      city: vendor.city || "",
      country: vendor.country || "",
      postalCode: vendor.postalCode || "",
      website: vendor.website || "",
      description: vendor.description || "",
      firstName: vendor.User?.firstName || "",
      lastName: vendor.User?.lastName || "",
      email: vendor.User?.email || "",
      phone: vendor.User?.phone || "",
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (vendor) => {
    setSelectedVendor(vendor)
    setShowDeleteModal(true)
  }

  // Open approval modal
  const openApprovalModal = (vendor) => {
    setSelectedVendor(vendor)
    setApprovalData({
      isApproved: !vendor.isApproved,
      rejectionReason: "",
    })
    setShowApprovalModal(true)
  }

  // Get approval status badge
  const getApprovalBadge = (isApproved) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {isApproved ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </>
        ) : (
          <>
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </>
        )}
      </span>
    )
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      suspended: { color: "bg-red-100 text-red-800", label: "Suspended" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  // Get vendor avatar
  const getVendorAvatar = (vendor) => {
    const initials =
      vendor.companyName
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "V"

    return (
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
        {initials}
      </div>
    )
  }

  // Statistics
  const stats = {
    total: totalVendors,
    approved: vendors.filter((v) => v.isApproved).length,
    pending: vendors.filter((v) => !v.isApproved).length,
    active: vendors.filter((v) => v.User?.status === "active").length,
  }

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <div
          className={`p-4 rounded-md ${
            alert.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          <div className="flex">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto text-sm underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

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
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
            >
              <option value="all">All Approval Status</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
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
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getVendorAvatar(vendor)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vendor.companyName}</div>
                        <div className="text-sm text-gray-500">
                          {vendor.User?.firstName} {vendor.User?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(vendor.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.User?.email}
                      </div>
                      {vendor.User?.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {vendor.User.phone}
                        </div>
                      )}
                      {vendor.city && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {vendor.city}, {vendor.country}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.businessType}</div>
                    {vendor.website && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="w-3 h-3 mr-1" />
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Package className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.totalProducts || 0} Products
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ShoppingCart className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.totalOrders || 0} Orders
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />${(vendor.totalRevenue || 0).toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getApprovalBadge(vendor.isApproved)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={vendor.User?.status || "pending"}
                      onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openDetailsModal(vendor)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Vendor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openApprovalModal(vendor)}
                        className={`${
                          vendor.isApproved
                            ? "text-yellow-600 hover:text-yellow-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={vendor.isApproved ? "Reject Vendor" : "Approve Vendor"}
                      >
                        {vendor.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openDeleteModal(vendor)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Vendor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * 20, totalVendors)}</span> of{" "}
                  <span className="font-medium">{totalVendors}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vendor Details Modal */}
      {showDetailsModal && selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Vendor Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Company Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-sm text-gray-900">{selectedVendor.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Type</label>
                      <p className="text-sm text-gray-900">{selectedVendor.businessType}</p>
                    </div>
                    {selectedVendor.tradeLicense && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Trade License</label>
                        <p className="text-sm text-gray-900">{selectedVendor.tradeLicense}</p>
                      </div>
                    )}
                    {selectedVendor.nid && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">NID</label>
                        <p className="text-sm text-gray-900">{selectedVendor.nid}</p>
                      </div>
                    )}
                    {selectedVendor.website && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <a
                          href={selectedVendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {selectedVendor.website}
                        </a>
                      </div>
                    )}
                    {selectedVendor.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-sm text-gray-900">{selectedVendor.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-sm text-gray-900">
                        {selectedVendor.User?.firstName} {selectedVendor.User?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedVendor.User?.email}</p>
                    </div>
                    {selectedVendor.User?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900">{selectedVendor.User.phone}</p>
                      </div>
                    )}
                    {selectedVendor.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-sm text-gray-900">
                          {selectedVendor.address}
                          {selectedVendor.city && `, ${selectedVendor.city}`}
                          {selectedVendor.country && `, ${selectedVendor.country}`}
                          {selectedVendor.postalCode && ` ${selectedVendor.postalCode}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Total Products</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedVendor.totalProducts || 0}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-900">Total Orders</p>
                      <p className="text-2xl font-bold text-green-600">{selectedVendor.totalOrders || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg col-span-2">
                      <p className="text-sm font-medium text-purple-900">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${(selectedVendor.totalRevenue || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Status
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Approval Status</label>
                      <div className="mt-1">{getApprovalBadge(selectedVendor.isApproved)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Status</label>
                      <div className="mt-1">{getStatusBadge(selectedVendor.User?.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Joined Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedVendor.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedVendor.User?.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedVendor.User?.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Products and Orders */}
              {selectedVendor.Products && selectedVendor.Products.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Products</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedVendor.Products.slice(0, 5).map((product) => (
                          <tr key={product.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">${product.price}</td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  product.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Vendor</h3>
              <form onSubmit={handleEditVendor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.companyName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.companyName && <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Type</label>
                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.businessType ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.businessType && <p className="mt-1 text-sm text-red-600">{formErrors.businessType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.firstName && <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trade License</label>
                    <input
                      type="text"
                      name="tradeLicense"
                      value={formData.tradeLicense}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NID</label>
                    <input
                      type="text"
                      name="nid"
                      value={formData.nid}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the business..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Update Vendor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Vendor Modal */}
      {showDeleteModal && selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Vendor</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-medium">{selectedVendor.companyName}</span>?
                  This action cannot be undone and will also delete the associated user account.
                </p>
              </div>
              <div className="flex justify-center space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedVendor(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVendor}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Delete Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {approvalData.isApproved ? "Approve" : "Reject"} Vendor
              </h3>
              <form onSubmit={handleVendorApproval} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 mb-4">
                    {approvalData.isApproved
                      ? `Are you sure you want to approve ${selectedVendor.companyName}?`
                      : `Are you sure you want to reject ${selectedVendor.companyName}?`}
                  </p>
                </div>

                {!approvalData.isApproved && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                    <textarea
                      name="rejectionReason"
                      value={approvalData.rejectionReason}
                      onChange={handleApprovalChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please provide a reason for rejection..."
                      required={!approvalData.isApproved}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowApprovalModal(false)
                      setSelectedVendor(null)
                      setApprovalData({ isApproved: false, rejectionReason: "" })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                      approvalData.isApproved ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {approvalData.isApproved ? "Approve" : "Reject"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageVendors
