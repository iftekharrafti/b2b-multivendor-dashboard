import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { categoriesAPI } from "../services/api"

const VendorSidebar = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoriesAPI.getAll()
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">
      <nav className="flex-1 p-4 space-y-4">
        <div className="mb-2 font-bold text-gray-700">Seller section</div>
        <Link to="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-100">Dashboard</Link>
        {/* ...other seller links... */}
        <Link to="/report" className="block py-2 px-3 rounded hover:bg-gray-100">Report</Link>
        <div className="mt-6 mb-2 font-bold text-gray-700">Buy Section</div>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="block w-full text-left py-2 px-3 rounded hover:bg-blue-50 text-blue-700"
              onClick={() => onCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}

export default VendorSidebar



import React, { useState } from "react"
import VendorSidebar from "../components/VendorSidebar"
import Header from "../components/Header"
import ProductDisplayPage from "./ProductDisplayPage"
import CartPage from "./CartPage"
import CheckoutPage from "./CheckoutPage"
import { CartProvider } from "../context/CartContext"

const DashboardLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [view, setView] = useState("products") // products | cart | checkout

  return (
    <CartProvider>
      <div className="flex h-screen">
        <VendorSidebar onCategoryClick={(id) => { setSelectedCategory(id); setView("products") }} />
        <div className="flex-1 flex flex-col">
          <Header onCartClick={() => setView("cart")} />
          <main className="flex-1 overflow-auto">
            {view === "products" && selectedCategory && (
              <ProductDisplayPage categoryId={selectedCategory} />
            )}
            {view === "cart" && (
              <CartPage onCheckout={() => setView("checkout")} />
            )}
            {view === "checkout" && (
              <CheckoutPage onOrderPlaced={() => setView("products")} />
            )}
            {!selectedCategory && view === "products" && (
              <div className="p-8 text-gray-500">Select a category to view products.</div>
            )}
          </main>
        </div>
      </div>
    </CartProvider>
  )
}

export default DashboardLayout


import React, { useContext } from "react"
import { ShoppingCart } from "lucide-react"
import { CartContext } from "../context/CartContext"

const Header = ({ onCartClick }) => {
  const { cartItems } = useContext(CartContext)
  const uniqueCount = Object.keys(cartItems).length

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-2xl font-bold text-gray-900">B2B Multi-vendor Dashboard</h1>
      <button className="relative" onClick={onCartClick}>
        <ShoppingCart className="w-7 h-7 text-blue-600" />
        {uniqueCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
            {uniqueCount}
          </span>
        )}
      </button>
    </header>
  )
}

export default Header
