import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ProductEdit from './ProductEdit';
import ProductDelete from './ProductDelete';

function ProductInfo() {
    const [product, setProduct] = useState(null);
    const { id } = useParams();  // Получаем ID продукта из URL

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Subcategory: {product.subcategory}</p>
            <img src={'/api'+product.imageUrl} alt={product.name} />
            <Link to={`/orders/${id}/edit`}>
                <button>Edit</button>
            </Link>
            <ProductDelete productId={id} />
            <Link to="/products">Back to Product List</Link>
        </div>
    );
}

export default ProductInfo;
