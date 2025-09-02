import React, { useContext, useEffect, useState } from "react"
import { CartContext } from "../context/CartContext"
import { cartAPI, ordersAPI, productsAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const CheckoutPage = ({ onOrderPlaced }) => {
    const { clearCart } = useContext(CartContext)
    const [cartItems, setCartItems] = useState([])
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [shippingCost, setShippingCost] = useState(80)
    const [loading, setLoading] = useState(false)

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCart = async () => {
            const res = await cartAPI.getCart()
            const items = JSON.parse(res.data.items) || []
            // Fetch product details for each item
            const detailedItems = await Promise.all(
                items.map(async (item) => {
                    const prodRes = await productsAPI.getById(item.productId)
                    return {
                        ...item,
                        name: prodRes.data.name,
                        price: prodRes.data.price,
                    }
                })
            )
            setCartItems(detailedItems)
        }
        fetchCart()
    }, [])

    const grandTotal =
        cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
        ) + shippingCost

    const handlePlaceOrder = async () => {
        if (!name || !phone || !address) {
            alert("Please fill all required fields.")
            return
        }
        setLoading(true)
        try {
            await ordersAPI.create({
                name,
                phone,
                shippingAddress: address,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                vendorId: user.id,
                shippingCost,
            })
            await cartAPI.clearCart()
            alert("Order placed successfully!")
            if (onOrderPlaced) onOrderPlaced()
            navigate("/orders")
        } catch (err) {
            alert("Failed to place order.")
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 max-w-4xl mx-auto">
            {/* Left: Form */}
            <div className="flex-1 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Shipping Address</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Shipping Cost</label>
                    <label className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="shipping"
                            checked={shippingCost === 80}
                            onChange={() => setShippingCost(80)}
                        />
                        <span className="ml-2">Inside Dhaka (80tk)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="shipping"
                            checked={shippingCost === 120}
                            onChange={() => setShippingCost(120)}
                        />
                        <span className="ml-2">Outside Dhaka (120tk)</span>
                    </label>
                </div>
            </div>
            {/* Right: Product Details */}
            <div className="flex-1 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between mb-2">
                        <span>
                            {item.name} x {item.quantity}
                        </span>
                        <span>Price: {item.price} tk</span>
                        <span>Subtotal: {(item.price || 0) * item.quantity} tk</span>
                    </div>
                ))}
                <div className="flex justify-between mt-4 font-bold">
                    <span>Shipping</span>
                    <span>{shippingCost} tk</span>
                </div>
                <div className="flex justify-between mt-2 font-bold text-lg">
                    <span>Total</span>
                    <span>{grandTotal} tk</span>
                </div>
                <button
                    className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </div>
        </div>
    )
}

export default CheckoutPage
