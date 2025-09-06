import React, { useEffect, useState, useContext } from "react"
import { productsAPI, cartAPI } from "../services/api"
import { CartContext } from "../context/CartContext"
import { useParams } from "react-router-dom"

const ProductDisplayPage = () => {
    const { id } = useParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { addToCart } = useContext(CartContext)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        productsAPI.getByCategory(id).then((res) => {
            console.log("res,,", res);
            setProducts(res.data)
            setLoading(false)
        })
    }, [id])

    const handleAddToCart = async (product) => {
        try {
            // Add product to cart via API
            await cartAPI.addToCart({ items: [{ productId: product.id, quantity: 1 }] })
            // Optionally fetch updated cart
            // const cartRes = await cartAPI.getCart()
            // setCartItems(cartRes.data.items)
            alert("Product added to cart!")
        } catch (err) {
            alert("Failed to add to cart.")
        }
    }

    if (loading) return <div>Loading products...</div>
    if (products.length === 0) return <div className="text-center ">No products found in this category.</div>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {products?.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                    {/* <img src={product.image} alt={product.name} className="mb-4" /> */}
                    {
                        console.log("product.images: ", product)
                    }
                    {
                        console.log(`http://localhost:5000/uploads/products/${JSON.parse(product.images)[0]}`)
                    }
                    {/* <img
                        src={`http://localhost:5000/uploads/products/${JSON.parse(product.images)[0]}`}
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                        alt="Product"
                    /> */}
                    <img
                        src={product.id==2 ? "/polo.jpg" : "/polo1.jpg"}
                        alt="Product"
                    />
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-700 mb-2">${product.price}</p>
                    <button
                        className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleAddToCart(product)}
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ProductDisplayPage
