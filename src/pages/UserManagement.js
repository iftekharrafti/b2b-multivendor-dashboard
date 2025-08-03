"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useAuth } from "../contexts/AuthContext"
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    Shield,
    ShieldCheck,
    X,
    Check,
    AlertCircle,
    User,
    Mail,
    Phone,
    Calendar,
} from "lucide-react"

const UserManagement = () => {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Pagination and filtering
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [verificationFilter, setVerificationFilter] = useState("")

    // Modals
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    // Form data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "vendor",
        phone: "",
        status: "pending",
    })

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(searchTerm && { search: searchTerm }),
                ...(roleFilter && { role: roleFilter }),
                ...(statusFilter && { status: statusFilter }),
                ...(verificationFilter && { verified: verificationFilter }),
            })

            const response = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }

            const data = await response.json()
            setUsers(data.users)
            setTotalPages(data.totalPages)
            setTotalUsers(data.total)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [currentPage, searchTerm, roleFilter, statusFilter, verificationFilter])

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Create user
    const handleCreateUser = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/admin/users", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to create user")
            }

            setSuccess("User created successfully")
            setShowAddModal(false)
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "vendor",
                phone: "",
                status: "pending",
            })
            fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    // Update user
    const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to update user")
            }

            setSuccess("User updated successfully")
            setShowEditModal(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    // Delete user
    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || "Failed to delete user")
            }

            setSuccess("User deleted successfully")
            setShowDeleteModal(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    // Toggle user verification
    const handleToggleVerification = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isVerified: !currentStatus }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || "Failed to update verification status")
            }

            setSuccess(`User ${!currentStatus ? "verified" : "unverified"} successfully`)
            fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    // Open edit modal
    const openEditModal = (user) => {
        setSelectedUser(user)
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "", // Don't populate password
            role: user.role,
            phone: user.phone || "",
            status: user.status,
        })
        setShowEditModal(true)
    }

    // Open delete modal
    const openDeleteModal = (user) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
    }

    // Clear messages
    const clearMessages = () => {
        setError("")
        setSuccess("")
    }

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-gray-100 text-gray-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "suspended":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Get role badge color
    const getRoleColor = (role) => {
        switch (role) {
            case "super_admin":
                return "bg-purple-100 text-purple-800"
            case "admin":
                return "bg-blue-100 text-blue-800"
            case "vendor":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Users className="mr-3 h-8 w-8" />
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage users, roles, and verification status</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                    <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        {success}
                    </div>
                    <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="vendor">Vendor</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    {/* Verification Filter */}
                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Verification</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                    </select>

                    {/* Clear Filters */}
                    <button
                        onClick={() => {
                            setSearchTerm("")
                            setRoleFilter("")
                            setStatusFilter("")
                            setVerificationFilter("")
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Verified</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.isVerified).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Shield className="w-8 h-8 text-yellow-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter((u) => !u.isVerified).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <User className="w-8 h-8 text-purple-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.status === "active").length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No users found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Verification
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-white">
                                                                {user.firstName?.charAt(0)}
                                                                {user.lastName?.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}
                                                >
                                                    {user.role.replace("_", " ").toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}
                                                >
                                                    {user.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleVerification(user.id, user.isVerified)}
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${user.isVerified
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                                        }`}
                                                >
                                                    {user.isVerified ? (
                                                        <>
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="w-3 h-3 mr-1" />
                                                            Not Verified
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    {user.role !== "super_admin" && (
                                                        <button
                                                            onClick={() => openDeleteModal(user)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
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
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
                                            <span className="font-medium">{Math.min(currentPage * 10, totalUsers)}</span> of{" "}
                                            <span className="font-medium">{totalUsers}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => setCurrentPage(index + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                    </>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength="6"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="vendor">Vendor</option>
                                            <option value="admin">Admin</option>
                                            {currentUser?.role === "super_admin" && <option value="super_admin">Super Admin</option>}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                            disabled={selectedUser.role === "super_admin"}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        >
                                            <option value="vendor">Vendor</option>
                                            <option value="admin">Admin</option>
                                            {currentUser?.role === "super_admin" && <option value="super_admin">Super Admin</option>}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete{" "}
                                <span className="font-medium">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </span>
                                ? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement
