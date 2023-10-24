import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import "./main.css"
function OrderList() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/orders', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }});
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <ul>
            {orders.map(order => (
                <li className={`order__product-p status-${order.status}`} key={order.id}>
                    <Link to={`/orders/${order.id}`}>id: {order.id}:{order.firstName}  </Link>
                </li>
            ))}
        </ul>
    );
}

export default OrderList;
