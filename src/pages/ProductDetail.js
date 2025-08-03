import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { productsAPI } from "../services/api"

const ProductDetail = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState(null)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const res = await productsAPI.getById(id)
                setProduct(res.data)
            } catch (err) {
                alert("Failed to load product details.")
            }
            setLoading(false)
        }
        fetchProduct()
    }, [id])

    if (loading || !product) return <div>Loading...</div>

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>SKU: {product.sku}</p>
            <p>Price: {product.price}</p>
            {/* Add more product details as needed */}
        </div>
    )
}

export default ProductDetail
