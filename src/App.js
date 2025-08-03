import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import DashboardLayout from "./components/Layout/DashboardLayout"

// Auth Pages
import Login from "./pages/Auth/Login"

// Dashboard Pages
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import AddProduct from "./pages/AddProduct"
import EditProduct from "./pages/EditProduct"
import Orders from "./pages/Orders"
import OrderDetail from "./pages/OrderDetail"
import RFQ from "./pages/RFQ"
import Customers from "./pages/Customers"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import Chat from "./pages/Chat"
import Inventory from "./pages/Inventory"
import Payments from "./pages/Payments"
import Reports from "./pages/Reports"

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard"
import ManageVendors from "./pages/ManageVendors"
import ManageCategories from "./pages/ManageCategories"
import SystemSettings from "./pages/SystemSettings"
import UserManagement from "./pages/UserManagement"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <Products />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <AddProduct />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <EditProduct />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <Orders />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <OrderDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rfq"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <RFQ />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <Customers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <Analytics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <DashboardLayout>
                    <Inventory />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Common Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Chat />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Payments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <DashboardLayout>
                    <UserManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <DashboardLayout>
                    <ManageVendors />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <DashboardLayout>
                    <ManageCategories />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <DashboardLayout>
                    <SystemSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
