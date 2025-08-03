import React, { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext, useAuth } from "../../contexts/AuthContext"
import { LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, BarChart3, Settings, User, Wallet, FileText, Shield, UserCog, Store, Tags, Cog, LogOut } from 'lucide-react'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["admin", "vendor", "super_admin"],
    },
    {
      title: "Products",
      icon: Package,
      path: "/products",
      roles: ["vendor"],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      path: "/orders",
      roles: ["vendor"],
    },
    {
      title: "Customers",
      icon: Users,
      path: "/customers",
      roles: ["vendor"],
    },
    {
      title: "Chat",
      icon: MessageSquare,
      path: "/chat",
      roles: ["admin", "vendor", "super_admin"],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/analytics",
      roles: ["vendor"],
    },
    {
      title: "Inventory",
      icon: Package,
      path: "/inventory",
      roles: ["vendor"],
    },
    {
      title: "Payments",
      icon: Wallet,
      path: "/payments",
      roles: ["admin", "vendor", "super_admin"],
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/reports",
      roles: ["admin", "vendor", "super_admin"],
    },
    // Admin only sections
    {
      title: "Admin Dashboard",
      icon: Shield,
      path: "/admin/dashboard",
      roles: ["admin", "super_admin"],
    },
    {
      title: "User Management",
      icon: UserCog,
      path: "/admin/users",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Manage Vendors",
      icon: Store,
      path: "/admin/vendors",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Manage Categories",
      icon: Tags,
      path: "/admin/categories",
      roles: ["admin", "super_admin"],
    },
    {
      title: "System Settings",
      icon: Cog,
      path: "/admin/settings",
      roles: ["admin", "super_admin"],
    },
    // Common sections
    {
      title: "Profile",
      icon: User,
      path: "/profile",
      roles: ["admin", "vendor", "super_admin"],
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["admin", "vendor", "super_admin"],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role))

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">B2B Dashboard</h1>
        <p className="text-sm text-gray-400 capitalize">{user?.role} Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
