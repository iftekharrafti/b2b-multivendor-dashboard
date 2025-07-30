"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Upload, X, Plus, Save } from "lucide-react"

const EditProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [images, setImages] = useState([])
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    sku: "",
    category: "",
    price: "",
    comparePrice: "",
    costPrice: "",
    stock: "",
    minOrderQuantity: "1",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    tags: "",
    status: "active",
    featured: false,
    trackQuantity: true,
    allowBackorder: false,
    requiresShipping: true,
    taxable: true,
    seoTitle: "",
    seoDescription: "",
    warranty: "",
    brand: "",
    model: "",
    origin: "",
  })

  const categories = [
    "Construction Materials",
    "Hardware",
    "Electrical",
    "Safety Equipment",
    "Tools & Machinery",
    "Plumbing",
    "HVAC",
    "Industrial Supplies",
    "Office Supplies",
    "Chemicals",
  ]

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock product data
        const mockProduct = {
          id: Number.parseInt(id),
          name: "Industrial Steel Pipes",
          description:
            "High-quality industrial steel pipes suitable for construction and manufacturing applications. Made from premium grade steel with excellent durability and corrosion resistance.",
          shortDescription: "Premium industrial steel pipes for construction",
          sku: "ISP-001",
          category: "Construction Materials",
          price: "125.99",
          comparePrice: "149.99",
          costPrice: "89.50",
          stock: "150",
          minOrderQuantity: "10",
          weight: "25.5",
          dimensions: {
            length: "300",
            width: "15",
            height: "15",
          },
          tags: "steel, pipes, industrial, construction",
          status: "active",
          featured: true,
          trackQuantity: true,
          allowBackorder: false,
          requiresShipping: true,
          taxable: true,
          brand: "SteelCorp",
          model: "SC-IP-300",
          warranty: "2 years",
          origin: "USA",
        }

        const mockImages = [
          {
            id: 1,
            url: "/placeholder.svg?height=200&width=200",
            name: "steel-pipes-1.jpg",
          },
          {
            id: 2,
            url: "/placeholder.svg?height=200&width=200",
            name: "steel-pipes-2.jpg",
          },
        ]

        const mockSpecs = [
          { key: "Material", value: "Carbon Steel" },
          { key: "Diameter", value: "15cm" },
          { key: "Length", value: "3m" },
          { key: "Thickness", value: "5mm" },
          { key: "Pressure Rating", value: "150 PSI" },
        ]

        setFormData(mockProduct)
        setImages(mockImages)
        setSpecifications(mockSpecs)
      } catch (error) {
        console.error("Error loading product:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target.result,
            file: file,
            name: file.name,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }])
  }

  const removeSpecification = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSpecification = (index, field, value) => {
    setSpecifications((prev) => prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Updated product data:", {
        ...formData,
        images,
        specifications: specifications.filter((spec) => spec.key && spec.value),
      })

      navigate("/products")
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/products")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed product description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <input
                      type="text"
                      name="sku"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Product SKU"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Brand name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      required
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="comparePrice"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.comparePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="costPrice"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Quantity</label>
                    <input
                      type="number"
                      name="minOrderQuantity"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.minOrderQuantity}
                      onChange={handleInputChange}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="trackQuantity"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.trackQuantity}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Track quantity</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="allowBackorder"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.allowBackorder}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Allow backorders</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">Upload product images</span>
                      <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</span>
                    </label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Spec
                </button>
              </div>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Specification name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured product</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Comma separated tags"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                    <input
                      type="number"
                      name="dimensions.length"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.dimensions.length}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      name="dimensions.width"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.dimensions.width}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      name="dimensions.height"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.dimensions.height}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="requiresShipping"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.requiresShipping}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Requires shipping</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="taxable"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.taxable}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Taxable</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
