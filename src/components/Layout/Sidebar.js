"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  MessageCircle,
  FileText,
  Wallet,
  Settings,
  User,
  X,
  Shield,
  Boxes,
  HelpCircle,
} from "lucide-react"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const vendorMenuItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/products", icon: Package, label: "Products" },
    { path: "/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/customers", icon: Users, label: "Customers" },
    { path: "/inventory", icon: Boxes, label: "Inventory" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/payments", icon: Wallet, label: "Payments" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/chat", icon: MessageCircle, label: "Messages" },
    { path: "/rfq", icon: HelpCircle, label: "RFQ" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ]

  const adminMenuItems = [
    { path: "/admin", icon: Shield, label: "Admin Dashboard" },
    { path: "/admin/vendors", icon: Users, label: "Manage Vendors" },
    { path: "/admin/categories", icon: Package, label: "Categories" },
    { path: "/admin/settings", icon: Settings, label: "System Settings" },
  ]

  const menuItems =
    user?.role === "admin" || user?.role === "super_admin" ? [...vendorMenuItems, ...adminMenuItems] : vendorMenuItems

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Dashboard</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.role?.replace("_", " ").toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
