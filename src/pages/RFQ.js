"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send,
  MessageSquare,
  X,
  Save,
  Users,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { vendorsAPI } from "../services/api"
import rfqAPI from "../services/rfqApi"

// Mock API functions (replace with your actual API)
// const rfqAPI = {
//   getAll: async (params = {}) => {
//     // Simulate API call
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: [
//             {
//               id: "RFQ-001",
//               title: "Industrial Steel Pipes - Bulk Order",
//               company: "ABC Construction Co.",
//               email: "procurement@abcconstruction.com",
//               category: "Construction Materials",
//               quantity: "500 units",
//               budget: "$50,000 - $75,000",
//               deadline: "2024-02-15",
//               status: "pending",
//               priority: "high",
//               description: "We need high-quality industrial steel pipes for our upcoming construction project. The pipes should meet ASTM standards and be suitable for heavy-duty industrial applications.",
//               createdAt: "2024-01-20T10:30:00Z",
//               responses: 0,
//             },
//             {
//               id: "RFQ-002",
//               title: "Safety Equipment Package",
//               company: "Metro Construction",
//               email: "safety@metroconst.com",
//               category: "Safety Equipment",
//               quantity: "100 sets",
//               budget: "$15,000 - $20,000",
//               deadline: "2024-02-10",
//               status: "quoted",
//               priority: "medium",
//               description: "Complete safety equipment package including helmets, vests, gloves, safety boots, and harnesses for construction workers.",
//               createdAt: "2024-01-18T14:15:00Z",
//               responses: 1,
//             },
//             {
//               id: "RFQ-003",
//               title: "Electrical Components",
//               company: "TechBuild Solutions",
//               email: "orders@techbuild.com",
//               category: "Electrical",
//               quantity: "200 units",
//               budget: "$25,000 - $30,000",
//               deadline: "2024-02-20",
//               status: "closed",
//               priority: "low",
//               description: "Various electrical components for industrial automation project including sensors, controllers, and wiring systems.",
//               createdAt: "2024-01-15T09:45:00Z",
//               responses: 3,
//             }
//           ]
//         })
//       }, 1000)
//     })
//   },

//   create: async (data) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: {
//             ...data,
//             id: `RFQ-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
//             createdAt: new Date().toISOString(),
//             responses: 0,
//             status: 'pending'
//           }
//         })
//       }, 500)
//     })
//   },

//   update: async (id, data) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ data: { ...data, id } })
//       }, 500)
//     })
//   },

//   delete: async (id) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ success: true })
//       }, 500)
//     })
//   }
// }

const RFQ = () => {
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("received")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentRfq, setCurrentRfq] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    email: '',
    category: '',
    quantity: '',
    budget: '',
    deadline: '',
    priority: 'medium',
    description: ''
  })

  const [vendors, setVendors] = useState([])

  const [selectedVendors, setSelectedVendors] = useState([])
  const [sendMessage, setSendMessage] = useState('')
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  // Load RFQs from API
  useEffect(() => {
    loadRfqs()
  }, [])

  // ---- Fetch vendors
  useEffect(() => {
    fetchVendors()
  }, [])
  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getAll()
      console.log("response,,", response);
      setVendors(response.data.vendors || [])
    } catch (err) {
      console.error("Error fetching vendors:", err)
    }
  }

  console.log("vendorsss", vendors);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 3000)
  }

  const loadRfqs = async () => {
    try {
      setLoading(true)
      const response = await rfqAPI.getAll({
        search: searchTerm,
        status: filterStatus === 'all' ? undefined : filterStatus
      })
      console.log("response--", response);
      setRfqs(response.data?.rfqs || [])
    } catch (error) {
      console.error('Error loading RFQs:', error)
      showNotification('error', 'Failed to load RFQs')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      customer: '',
      email: '',
      category: '',
      quantity: '',
      budget: '',
      deadline: '',
      priority: 'medium',
      description: ''
    })
  }

  const validateForm = () => {
    const required = ['title', 'customer', 'email', 'category', 'deadline', 'description']
    return required.every(field => formData[field].trim() !== '')
  }

  const handleCreateRfq = async () => {
    if (!validateForm()) {
      showNotification('error', 'Please fill in all required fields')
      return
    }

    try {
      setSubmitLoading(true)
      const response = await rfqAPI.create({
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        responses: 0
      })

      setRfqs([response.data, ...rfqs])
      setShowCreateModal(false)
      resetForm()
      showNotification('success', 'RFQ created successfully!')
    } catch (error) {
      console.error('Error creating RFQ:', error)
      showNotification('error', 'Failed to create RFQ')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleViewRfq = (rfq) => {
    setCurrentRfq(rfq)
    setShowViewModal(true)
  }

  const handleEditRfq = (rfq) => {
    setCurrentRfq(rfq)
    setFormData({
      title: rfq.title || '',
      customer: rfq.company || '',
      email: rfq.email || '',
      category: rfq.category || '',
      quantity: rfq.quantity || '',
      budget: rfq.budget || '',
      deadline: rfq.deadline || '',
      priority: rfq.priority || 'medium',
      description: rfq.description || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateRfq = async () => {
    if (!validateForm()) {
      showNotification('error', 'Please fill in all required fields')
      return
    }

    try {
      setSubmitLoading(true)
      const response = await rfqAPI.update(currentRfq.id, formData)

      setRfqs(rfqs.map(rfq =>
        rfq.id === currentRfq.id
          ? { ...rfq, ...formData, company: formData.customer }
          : rfq
      ))
      setShowEditModal(false)
      setCurrentRfq(null)
      resetForm()
      showNotification('success', 'RFQ updated successfully!')
    } catch (error) {
      console.error('Error updating RFQ:', error)
      showNotification('error', 'Failed to update RFQ')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteRfq = async (rfqId) => {
    if (!window.confirm("Are you sure you want to delete this RFQ? This action cannot be undone.")) return

    try {
      await rfqAPI.delete(rfqId)
      setRfqs(rfqs?.filter(r => r.id !== rfqId))
      showNotification('success', 'RFQ deleted successfully!')
    } catch (error) {
      console.error('Error deleting RFQ:', error)
      showNotification('error', 'Failed to delete RFQ')
    }
  }

  const handleSendRfq = (rfq) => {
    setCurrentRfq(rfq)
    setSelectedVendors([])
    setSendMessage(`Hi,

We have a new RFQ that might be of interest to you:

Title: ${rfq.title}
Category: ${rfq.category}
Quantity: ${rfq.quantity}
Budget: ${rfq.budget}
Deadline: ${new Date(rfq.deadline).toLocaleDateString()}

Description:
${rfq.description}

Please review and submit your quote if interested.

Best regards,
Your Procurement Team`)
    setShowSendModal(true)
  }

  const handleSendToVendors = async (currentRfq) => {
    console.log("currentRfq:,,, ", currentRfq);

    console.log("selectedVendors,,", selectedVendors);
    if (selectedVendors.length === 0) {
      showNotification('error', 'Please select at least one vendor')
      return
    }

    try {
      setSubmitLoading(true)

      // In a real app, you'd call an API to send emails/notifications
      const selectedVendorDetails = selectedVendors.map(id =>
        vendors.find(v => v.id === id)
      )?.filter(Boolean)

      const data = {
        // price,
        // notes,
        // deliveryTime,
        // terms,
        price: currentRfq.budget,
        notes: sendMessage,
        deliveryTime: currentRfq.deadline,
        terms: ""
      }

      // Simulate API call
      const response = await rfqAPI.submitResponse(currentRfq.id, data)
      console.log("response,,", response);

      setShowSendModal(false)
      setSelectedVendors([])
      setSendMessage('')
      showNotification('success', `RFQ sent successfully to ${selectedVendorDetails.length} vendor(s)!`)
    } catch (error) {
      console.error('Error sending RFQ:', error)
      showNotification('error', 'Failed to send RFQ')
    } finally {
      setSubmitLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      quoted: {
        color: "bg-blue-100 text-blue-800",
        icon: FileText,
        label: "Quoted",
      },
      closed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Closed",
      },
      expired: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Expired",
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

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[priority]}`}
      >
        {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
      </span>
    )
  }

  const filteredRfqs = rfqs?.filter((rfq) => {
    const matchesSearch =
      rfq.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      rfq.company?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      rfq.category?.toLowerCase().includes(searchTerm?.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    console.log("matchesSearch", matchesSearch);
    return matchesSearch && rfq.status === filterStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    })
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
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request for Quotes (RFQ)</h1>
          <p className="text-gray-600">Manage quote requests from customers and send to vendors</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create RFQ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total RFQs</p>
              <p className="text-2xl font-bold text-gray-900">{rfqs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{rfqs?.filter((r) => r.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quoted</p>
              <p className="text-2xl font-bold text-gray-900">{rfqs?.filter((r) => r.status === "quoted").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-900">{rfqs?.filter((r) => r.status === "closed").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("received")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "received"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              All RFQs ({rfqs?.length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "sent"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Sent to Vendors
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search RFQs by title, company, or category..."
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
                <option value="pending">Pending</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* RFQ List */}
        <div className="divide-y divide-gray-200">
          {filteredRfqs?.map((rfq) => (
            <div key={rfq.id} className="p-6 hover:bg-gray-50 transition-colors">
              {console.log("rfq", rfq)}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{rfq.title}</h3>
                    {getStatusBadge(rfq.status)}
                    {/* {getPriorityBadge(rfq.priority)} */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    {/* <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{rfq.company}</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-900">{rfq.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium text-gray-900">{rfq.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium text-gray-900">{rfq.budget}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{rfq.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Deadline: {formatDate(rfq.deadline)}</span>
                    <span>Created: {formatDate(rfq.createdAt)}</span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {rfq.responses} responses
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewRfq(rfq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSendRfq(rfq)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Send to Vendors"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditRfq(rfq)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit RFQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRfq(rfq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete RFQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRfqs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No RFQs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first RFQ."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First RFQ
              </button>
            )}
          </div>
        )}
      </div>

      {/* View RFQ Modal */}
      {showViewModal && currentRfq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">RFQ Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{currentRfq.title}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(currentRfq.status)}
                    {getPriorityBadge(currentRfq.priority)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  ID: {currentRfq.id}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{currentRfq.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{currentRfq.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{currentRfq.category}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quantity</label>
                    <p className="text-gray-900">{currentRfq.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget</label>
                    <p className="text-gray-900">{currentRfq.budget}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deadline</label>
                    <p className="text-gray-900">{formatDate(currentRfq.deadline)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{currentRfq.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Created: {formatDateTime(currentRfq.createdAt)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {currentRfq.responses} responses received
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEditRfq(currentRfq)
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit RFQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create RFQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New RFQ</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RFQ Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter RFQ title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Customer name"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="customer@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Construction Materials">Construction Materials</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Safety Equipment">Safety Equipment</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Industrial Equipment">Industrial Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 100 units"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $10,000 - $15,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your requirements in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRfq}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!validateForm() || submitLoading}
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create RFQ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit RFQ Modal */}
      {showEditModal && currentRfq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit RFQ</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setCurrentRfq(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RFQ Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter RFQ title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Customer name"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="customer@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Construction Materials">Construction Materials</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Safety Equipment">Safety Equipment</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Industrial Equipment">Industrial Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 100 units"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $10,000 - $15,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your requirements in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setCurrentRfq(null)
                  resetForm()
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRfq}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!validateForm() || submitLoading}
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update RFQ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Vendors Modal */}
      {showSendModal && currentRfq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Send RFQ to Vendors</h2>
              <button
                onClick={() => {
                  setShowSendModal(false)
                  setSelectedVendors([])
                  setSendMessage('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* RFQ Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">RFQ Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <p className="font-medium text-gray-900 mt-1">{currentRfq.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium text-gray-900 mt-1">{currentRfq.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <p className="font-medium text-gray-900 mt-1">{currentRfq.budget}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Deadline:</span>
                    <p className="font-medium text-gray-900 mt-1">{formatDate(currentRfq.deadline)}</p>
                  </div>
                </div>
              </div>

              {/* Vendor Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Select Vendors</h3>
                  <div className="text-sm text-gray-500">
                    {selectedVendors.length} of {vendors.length} selected
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedVendors.includes(vendor.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => {
                        if (selectedVendors.includes(vendor.id)) {
                          setSelectedVendors(selectedVendors.filter(id => id !== vendor.id))
                        } else {
                          setSelectedVendors([...selectedVendors, vendor.id])
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`vendor-${vendor.id}`}
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => { }} // Handled by parent div onClick
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">{vendor.companyName}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {vendor.User.email}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <span>★ {vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {vendors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No vendors available</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedVendors(vendors.map(v => v.id))}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedVendors([])}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setSelectedVendors(
                    vendors.filter(v => v.category === currentRfq.category).map(v => v.id)
                  )}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Select by Category ({currentRfq.category})
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Vendors
                </label>
                <textarea
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  placeholder="Enter your message to vendors..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be sent to all selected vendors along with the RFQ details.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedVendors.length > 0 ? (
                  `Ready to send to ${selectedVendors.length} vendor${selectedVendors.length !== 1 ? 's' : ''}`
                ) : (
                  'Please select at least one vendor'
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSendModal(false)
                    setSelectedVendors([])
                    setSendMessage('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                {
                  console.log("currentRfq: ", currentRfq)
                }
                <button
                  onClick={() => handleSendToVendors(currentRfq)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedVendors.length === 0 || submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send RFQ ({selectedVendors.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RFQ