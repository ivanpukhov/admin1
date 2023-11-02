import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ProductEdit from './ProductEdit';
import ProductDelete from './ProductDelete';

function ProductInfo() {
    const [product, setProduct] = useState(null);
    const { id } = useParams();  // Получаем ID продукта из URL
    const handleAvailabilityChange = async (e) => {
        const isAvailable = e.target.checked ? 1 : 0; // Преобразование состояния чекбокса в значение для isAvailable
        try {
            await axios.put(`/api/products/${id}`, { ...product, isAvailable }); // Отправка обновленного состояния на сервер
            setProduct({ ...product, isAvailable }); // Обновление состояния продукта
        } catch (error) {
            console.error('Error updating product availability:', error);
        }
    };
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
            <p>Наличие
                <input
                    type="checkbox"
                    checked={product.isAvailable === 1} // Установка состояния чекбокса на основе isAvailable
                    onChange={handleAvailabilityChange} // Привязка обработчика изменения
                />
            </p>
            <ProductDelete productId={id} />
            <Link to="/products">Back to Product List</Link>
        </div>
    );
}

export default ProductInfo;
