import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import DashboardLayout from "./components/Layout/DashboardLayout"

// Auth pages
import Login from "./pages/Auth/Login"

// Dashboard pages
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import AddProduct from "./pages/AddProduct"
import EditProduct from "./pages/EditProduct"
import Orders from "./pages/Orders"
import OrderDetail from "./pages/OrderDetail"
import Customers from "./pages/Customers"
import Chat from "./pages/Chat"
import RFQ from "./pages/RFQ"
import Inventory from "./pages/Inventory"
import Analytics from "./pages/Analytics"
import Payments from "./pages/Payments"
import Reports from "./pages/Reports"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"

// Admin pages
import AdminDashboard from "./pages/AdminDashboard"
import UserManagement from "./pages/UserManagement"
import ManageVendors from "./pages/ManageVendors"
import ManageCategories from "./pages/ManageCategories"
import SystemSettings from "./pages/SystemSettings"
import ProductDetail from "./pages/ProductDetail"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Common routes */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chat" element={<Chat />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="payments" element={<Payments />} />
              <Route path="reports" element={<Reports />} />

              {/* Vendor routes */}
              <Route
                path="products"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="add-product"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-product/:id"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/:id"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute allowedRoles={["admin", "vendor", "super_admin"]}>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <ProtectedRoute allowedRoles={["admin", "vendor", "super_admin"]}>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rfq"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <RFQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="inventory"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/vendors"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <ManageVendors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/categories"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <ManageCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
