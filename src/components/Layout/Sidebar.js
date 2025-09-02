"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  Wallet,
  FileText,
  UserCog,
  Store,
  Grid3X3,
  Cog,
  LogOut,
} from "lucide-react"
import { useEffect, useState } from "react"
import { categoriesAPI } from "../../services/api"

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoriesAPI.getAll()
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

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
      title: "Add Product",
      icon: Package,
      path: "/add-product",
      roles: ["vendor"],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      path: "/orders",
      roles: ["admin", "vendor", "super_admin"],
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
      title: "RFQ",
      icon: FileText,
      path: "/rfq",
      roles: ["vendor"],
    },
    {
      title: "Inventory",
      icon: Package,
      path: "/inventory",
      roles: ["vendor"],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/analytics",
      roles: ["admin", "vendor", "super_admin"],
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
    // Admin only routes
    {
      title: "Admin Dashboard",
      icon: LayoutDashboard,
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
      icon: Grid3X3,
      path: "/admin/categories",
      roles: ["admin", "super_admin"],
    },
    {
      title: "System Settings",
      icon: Cog,
      path: "/admin/settings",
      roles: ["admin", "super_admin"],
    },
    // Common routes
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

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold">B2B Dashboard</h2>
        <p className="text-sm text-gray-300 capitalize">{user?.role} Panel</p>
      </div>
      {console.log("user?.role:", user?.role)}

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          <h2 className="text-xl font-bold text-gray-400">{user?.role === 'vendor' && "Seller Section"}</h2>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isActive(item.path) ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>

        <div>
          <h2 className="text-xl font-bold text-gray-400">{user?.role === 'vendor' && "Buy Section"}</h2>

          {
            user?.role === 'vendor' && (
              <p className="text-sm text-gray-300">Browse and purchase products</p>
            )
          }
        </div>
        {
          user?.role === 'vendor' && (
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  to={`/category/${cat.id}`}
                  key={cat.id}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors $text-gray-300 hover:bg-gray-700 hover:text-white`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )
        }

      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
