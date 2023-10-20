import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ProductInfo() {
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState(null);
    const { id } = useParams();
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/orders/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                setOrder(response.data);
                fetchProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchOrder();
    }, [id]);

    const updateOrderStatus = async (status) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`/api/orders/${id}/status`, { status: status }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setOrderStatus(status);  // Обновление состояния orderStatus
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };


    const fetchProducts = async (productsString) => {
        try {
            const productsArray = JSON.parse(productsString);
            if (!Array.isArray(productsArray)) {
                console.error('Parsed products is not an array:', productsArray);
                return;
            }

            const productPromises = productsArray.map(async product => {
                const response = await axios.get(`/api/products/${product.id}`);
                return {
                    ...product,
                    name: response.data.name
                };
            });
            const productsWithData = await Promise.all(productPromises);
            setProducts(productsWithData);
        } catch (error) {
            console.error('Error fetching or parsing product names:', error);
        }
    };


    if (!order || !products) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fa">
            <li className="order__user">
                {order.firstName + " " +order.lastName}
            </li>
            <li className="order__user">
                {order.phoneNumber}
            </li>
            <li className="order__user">
                {order.address}
            </li>
            <ul>
                {products.map(product => (
                    <li className="order__product" key={product.id}>{product.name} <br/> (Колличество: {product.quantity})</li>
                ))}
            </ul>
            <button
                className={`checkout__btn ${orderStatus === 2 ? 'btn-active' : ''}`}
                onClick={() => updateOrderStatus(2)}
            >
                {orderStatus === 2 ? 'Принято' : 'Отметить принятым'}
            </button>
            <button
                className={`checkout__btn ${orderStatus === 3 ? 'btn-active' : ''}`}
                onClick={() => updateOrderStatus(3)}
            >
                {orderStatus === 3 ? 'Выполнено' : 'Отметить выполненным'}
            </button>
            <Link className="checkout__btn" to="/orders">Вернуться к списку заказов</Link>
        </div>
    );
}

export default ProductInfo;
