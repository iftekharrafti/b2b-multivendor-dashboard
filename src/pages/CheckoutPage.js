import React, { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"
import { ordersAPI } from "../services/api"

const CheckoutPage = ({ onOrderPlaced }) => {
    const { cartItems, clearCart } = useContext(CartContext)
    const items = Object.values(cartItems)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [shippingCost, setShippingCost] = useState(80)
    const [loading, setLoading] = useState(false)

    const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost

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
                items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
                shippingCost,
            })
            clearCart()
            alert("Order placed successfully!")
            if (onOrderPlaced) onOrderPlaced()
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
                    <input type="text" className="w-full border px-3 py-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Phone</label>
                    <input type="text" className="w-full border px-3 py-2 rounded" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Shipping Address</label>
                    <textarea className="w-full border px-3 py-2 rounded" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Shipping Cost</label>
                    <label className="flex items-center mb-1">
                        <input type="radio" name="shipping" checked={shippingCost === 80} onChange={() => setShippingCost(80)} />
                        <span className="ml-2">Inside Dhaka (80tk)</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="shipping" checked={shippingCost === 120} onChange={() => setShippingCost(120)} />
                        <span className="ml-2">Outside Dhaka (120tk)</span>
                    </label>
                </div>
            </div>
            {/* Right: Product Details */}
            <div className="flex-1 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between mb-2">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} tk</span>
                    </div>
                ))}
                <div className="flex justify-between mt-4 font-bold">
                    <span>Shipping</span>
                    <span>{shippingCost} tk</span>
                </div>
                <div className="flex justify-between mt-2 font-bold text-lg">
                    <span>Total</span>
                    <span>{grandTotal.toFixed(2)} tk</span>
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
