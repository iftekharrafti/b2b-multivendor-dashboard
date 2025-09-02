import React, { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { Link } from "react-router-dom"

const CartPage = ({ onCheckout }) => {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext)
    const items = Object.values(cartItems)
    const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {items.length === 0 ? (
                <div>Your cart is empty.</div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
                            <div>
                                <div className="font-bold">{item.name}</div>
                                <div className="text-gray-700">${item.price}</div>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2">-</button>
                                <span className="px-2">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2">+</button>
                            </div>
                            <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-600 px-2">Remove</button>
                        </div>
                    ))}
                    <div className="text-right font-bold text-lg mt-6">Grand Total: ${grandTotal.toFixed(2)}</div>
                    <Link
                        to="/checkout"
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CartPage
