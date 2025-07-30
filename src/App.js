import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"

// Layout Components
import DashboardLayout from "./components/Layout/DashboardLayout"
import ProtectedRoute from "./components/Auth/ProtectedRoute"

// Auth Pages
import Login from "./pages/Auth/Login"

// Dashboard Pages
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import AddProduct from "./pages/AddProduct"
import EditProduct from "./pages/EditProduct"
import Orders from "./pages/Orders"
import OrderDetail from "./pages/OrderDetail"
import Customers from "./pages/Customers"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import Chat from "./pages/Chat"
import RFQ from "./pages/RFQ"
import Inventory from "./pages/Inventory"
import Payments from "./pages/Payments"
import Reports from "./pages/Reports"

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard"
import ManageVendors from "./pages/ManageVendors"
import ManageCategories from "./pages/ManageCategories"
import SystemSettings from "./pages/SystemSettings"

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Vendor Dashboard Routes */}
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="payments" element={<Payments />} />
              <Route path="reports" element={<Reports />} />
              <Route path="chat" element={<Chat />} />
              <Route path="rfq" element={<RFQ />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/vendors" element={<ManageVendors />} />
              <Route path="admin/categories" element={<ManageCategories />} />
              <Route path="admin/settings" element={<SystemSettings />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
