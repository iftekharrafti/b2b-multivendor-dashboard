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
} from "lucide-react"

const RFQ = () => {
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("received")
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data - replace with API call
  useEffect(() => {
    const mockRfqs = [
      {
        id: "RFQ-001",
        title: "Industrial Steel Pipes - Bulk Order",
        company: "ABC Construction Co.",
        email: "procurement@abcconstruction.com",
        category: "Construction Materials",
        quantity: "500 units",
        budget: "$50,000 - $75,000",
        deadline: "2024-02-15",
        status: "pending",
        priority: "high",
        description: "We need high-quality industrial steel pipes for our upcoming construction project...",
        createdAt: "2024-01-20T10:30:00Z",
        responses: 0,
      },
      {
        id: "RFQ-002",
        title: "Safety Equipment Package",
        company: "Metro Construction",
        email: "safety@metroconst.com",
        category: "Safety Equipment",
        quantity: "100 sets",
        budget: "$15,000 - $20,000",
        deadline: "2024-02-10",
        status: "quoted",
        priority: "medium",
        description: "Complete safety equipment package including helmets, vests, gloves...",
        createdAt: "2024-01-18T14:15:00Z",
        responses: 1,
      },
      {
        id: "RFQ-003",
        title: "Electrical Components",
        company: "TechBuild Solutions",
        email: "orders@techbuild.com",
        category: "Electrical",
        quantity: "200 units",
        budget: "$25,000 - $30,000",
        deadline: "2024-02-20",
        status: "closed",
        priority: "low",
        description: "Various electrical components for industrial automation project...",
        createdAt: "2024-01-15T09:45:00Z",
        responses: 3,
      },
    ]

    setTimeout(() => {
      setRfqs(mockRfqs)
      setLoading(false)
    }, 1000)
  }, [])

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
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.category.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && rfq.status === filterStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleCreateRfq = () => {
    setShowCreateModal(true)
  }

  const handleDeleteRfq = (rfqId) => {
    if (window.confirm("Are you sure you want to delete this RFQ?")) {
      setRfqs(rfqs.filter((r) => r.id !== rfqId))
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request for Quotes (RFQ)</h1>
          <p className="text-gray-600">Manage quote requests from customers</p>
        </div>
        <button
          onClick={handleCreateRfq}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
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
              <p className="text-2xl font-bold text-gray-900">{rfqs.filter((r) => r.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quoted</p>
              <p className="text-2xl font-bold text-gray-900">{rfqs.filter((r) => r.status === "quoted").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-900">{rfqs.filter((r) => r.status === "closed").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("received")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "received"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Received RFQs
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Sent Quotes
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
                  placeholder="Search RFQs..."
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
          {filteredRfqs.map((rfq) => (
            <div key={rfq.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{rfq.title}</h3>
                    {getStatusBadge(rfq.status)}
                    {getPriorityBadge(rfq.priority)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{rfq.company}</p>
                    </div>
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
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRfq(rfq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                : "Get started by creating your first quote response."}
            </p>
          </div>
        )}
      </div>

      {/* Create RFQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Quote Response</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RFQ Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quote title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Construction Materials</option>
                    <option>Hardware</option>
                    <option>Electrical</option>
                    <option>Safety Equipment</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your quote requirements"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Amount</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RFQ
