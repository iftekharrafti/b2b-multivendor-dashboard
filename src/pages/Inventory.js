"use client"

import { useState, useEffect } from "react"
import { Package, AlertTriangle, TrendingDown, TrendingUp, Search, Filter, Download, Plus } from "lucide-react"

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const mockInventory = [
      {
        id: 1,
        name: "Industrial Steel Pipes",
        sku: "ISP-001",
        category: "Construction Materials",
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        reorderPoint: 75,
        unitCost: 89.5,
        totalValue: 13425.0,
        lastRestocked: "2024-01-15",
        status: "in_stock",
      },
      {
        id: 2,
        name: "Heavy Duty Bolts Set",
        sku: "HDB-002",
        category: "Hardware",
        currentStock: 25,
        minStock: 30,
        maxStock: 200,
        reorderPoint: 40,
        unitCost: 22.75,
        totalValue: 568.75,
        lastRestocked: "2024-01-10",
        status: "low_stock",
      },
      {
        id: 3,
        name: "Commercial Grade Cement",
        sku: "CGC-003",
        category: "Construction Materials",
        currentStock: 0,
        minStock: 20,
        maxStock: 100,
        reorderPoint: 25,
        unitCost: 45.0,
        totalValue: 0,
        lastRestocked: "2024-01-05",
        status: "out_of_stock",
      },
      {
        id: 4,
        name: "Electrical Wire Bundle",
        sku: "EWB-004",
        category: "Electrical",
        currentStock: 85,
        minStock: 25,
        maxStock: 150,
        reorderPoint: 35,
        unitCost: 117.0,
        totalValue: 9945.0,
        lastRestocked: "2024-01-18",
        status: "in_stock",
      },
      {
        id: 5,
        name: "Safety Equipment Kit",
        sku: "SEK-005",
        category: "Safety",
        currentStock: 15,
        minStock: 20,
        maxStock: 80,
        reorderPoint: 25,
        unitCost: 78.38,
        totalValue: 1175.7,
        lastRestocked: "2024-01-12",
        status: "low_stock",
      },
    ]

    setTimeout(() => {
      setInventory(mockInventory)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (item) => {
    if (item.currentStock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Out of Stock
        </span>
      )
    }
    if (item.currentStock <= item.reorderPoint) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <TrendingDown className="w-3 h-3 mr-1" />
          Low Stock
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <TrendingUp className="w-3 h-3 mr-1" />
        In Stock
      </span>
    )
  }

  const getStockLevel = (item) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    let colorClass = "bg-green-500"

    if (percentage <= 20) colorClass = "bg-red-500"
    else if (percentage <= 40) colorClass = "bg-yellow-500"

    return { percentage, colorClass }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && item.status === filterStatus
  })

  const getInventoryStats = () => {
    const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
    const lowStockItems = inventory.filter((item) => item.currentStock <= item.reorderPoint).length
    const outOfStockItems = inventory.filter((item) => item.currentStock === 0).length

    return {
      totalItems: inventory.length,
      totalValue,
      lowStockItems,
      outOfStockItems,
    }
  }

  const stats = getInventoryStats()

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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStockItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search inventory..."
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
              <option value="all">All Items</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockLevel = getStockLevel(item)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentStock} units</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${stockLevel.colorClass}`}
                          style={{ width: `${Math.min(stockLevel.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{stockLevel.percentage.toFixed(0)}% of max</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reorderPoint} units</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.totalValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Inventory
