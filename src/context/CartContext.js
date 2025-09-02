import React, { createContext, useState } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({})

    const addToCart = (product) => {
        setCartItems((prev) => {
            if (prev[product.id]) {
                return {
                    ...prev,
                    [product.id]: {
                        ...prev[product.id],
                        quantity: prev[product.id].quantity + 1,
                    },
                }
            }
            return {
                ...prev,
                [product.id]: { ...product, quantity: 1 },
            }
        })
    }

    const updateQuantity = (id, quantity) => {
        setCartItems((prev) => {
            if (quantity < 1) {
                const { [id]: _, ...rest } = prev
                return rest
            }
            return {
                ...prev,
                [id]: { ...prev[id], quantity },
            }
        })
    }

    const removeFromCart = (id) => {
        setCartItems((prev) => {
            const { [id]: _, ...rest } = prev
            return rest
        }) 
    }

    const clearCart = () => setCartItems({})

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}
