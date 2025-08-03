"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  console.log(user)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dashboard-spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has dashboard access
  if (!["vendor", "admin", "super_admin"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
