import React, { useContext, useEffect, useState } from "react"
import { CartContext } from "../context/CartContext"
import { Link } from "react-router-dom"
import { cartAPI, productsAPI } from "../services/api"

const CartPage = ({ onCheckout }) => {
    const { cartItems: contextCartItems, updateQuantity, removeFromCart } = useContext(CartContext)
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true)
            const res = await cartAPI.getCart()
            const items = JSON.parse(res.data.items) || []
            // Fetch product details for each item
            console.log("items:::", items);
            const detailedItems = await Promise.all(items?.map(async (item) => {
                console.log("item:", item);
                const prodRes = await productsAPI.getById(item.productId)
                console.log("prodRes:", prodRes);
                return {
                    ...item,
                    name: prodRes.data.name,
                    price: prodRes.data.price,
                }
            }))
            setCartItems(detailedItems)
            setLoading(false)
        }
        fetchCart()
    }, [])

    const grandTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

    if (loading) return <div>Loading cart...</div>

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <div>Your cart is empty.</div>
            ) : (
                <div className="space-y-4">
                    {cartItems?.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded shadow">
                            <div>
                                <div className="font-bold">{item.name}</div>
                                <div className="text-gray-700">Price: {item.price} tk</div>
                                <div className="text-gray-700">Quantity: {item.quantity}</div>
                            </div>
                            <div className="font-bold">Subtotal: {(item.price || 0) * item.quantity} tk</div>
                        </div>
                    ))}
                    <div className="text-right font-bold text-lg mt-6">Grand Total: {grandTotal} tk</div>
                    <Link
                        to="/checkout"
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={onCheckout}
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CartPage
