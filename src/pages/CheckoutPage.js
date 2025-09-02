import React, { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"

const CheckoutPage = ({ onOrderPlaced }) => {
    const { cartItems, clearCart } = useContext(CartContext)
    const items = Object.values(cartItems)
    const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const [payment, setPayment] = useState("cod")

    const handlePlaceOrder = () => {
        // Here you would send order to backend
        alert(`Order placed! Payment: ${payment}, Total: $${grandTotal.toFixed(2)}`)
        clearCart()
        if (onOrderPlaced) onOrderPlaced()
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <div className="mb-6 bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between mb-1">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div className="font-bold text-right mt-2">Total: ${grandTotal.toFixed(2)}</div>
            </div>
            <div className="mb-6 bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Payment Options</h3>
                <label className="flex items-center mb-2">
                    <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} />
                    <span className="ml-2">Cash on Delivery</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="payment" value="online" checked={payment === "online"} onChange={() => setPayment("online")} />
                    <span className="ml-2">Online Payment</span>
                </label>
            </div>
            <button
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                onClick={handlePlaceOrder}
            >
                Place Order
            </button>
        </div>
    )
}

export default CheckoutPage
