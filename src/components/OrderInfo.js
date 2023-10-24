import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams, Link, useNavigate} from 'react-router-dom';

function ProductInfo() {
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const {id} = useParams();
    const [orderStatus, setOrderStatus] = useState(null);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
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

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchAutocompleteResults = async (query) => {
        try {
            const response = await axios.get(`/api/search/autocompleter?q=${query}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching autocomplete results:', error);
        }
    };

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            fetchAutocompleteResults(query);
        } else {
            setSearchResults([]);
        }
    };

    const addProductToOrder = async (productId, productName) => {
        const quantity = prompt(`Введите количество для товара ${productName}`);

        if (quantity) {
            const newProduct = {
                id: productId,
                quantity: parseInt(quantity),
            };

            const updatedProducts = [...products, newProduct];
            const updatedOrder = {
                ...order,
                products: updatedProducts,
            };

            try {
                const token = localStorage.getItem('jwtToken');
                await axios.put(`/api/orders/${id}`, updatedOrder, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                });
                // Обновляем содержимое страницы
                await fetchOrder();
                setSearchQuery("");
                setSearchResults([]);
                searchInputRef.current.blur();
            } catch (error) {
                console.error('Error updating order:', error);
            }
        }
    };

    const calculateTotalPrice = (products) => {
        return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    };



    const deleteOrder = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`/api/orders/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            navigate('/orders');
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const deleteProductFromOrder = async (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        const updatedOrder = {
            ...order,
            products: updatedProducts
        };

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`/api/orders/${id}`, updatedOrder, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const updateOrderStatus = async (status) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`/api/orders/${id}/status`, {status: status}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setOrderStatus(status);
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
                    name: response.data.name,
                    price: response.data.price
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

    const totalPrice = calculateTotalPrice(products); // Вызов функции для расчета общей стоимости


    return (
        <div className="fa">
            <li className="order__user">
                {order.firstName + " " + order.lastName}
            </li>
            <li className="order__user">
                {order.phoneNumber}
            </li>
            <li className="order__user">
                {order.address}
            </li>

            <ul>
                {products.map(product => (
                    <li className="order__product" key={product.id}>
                        {product.name} <br/> (Количество: {product.quantity}) {product.price * product.quantity * 0.95} тг.
                        <button onClick={() => deleteProductFromOrder(product.id)}>❌</button>
                    </li>
                ))}
            </ul>

            <input
                type="text"
                placeholder="Добавить товар в заказ"
                value={searchQuery}
                className='order__product-add'
                onChange={handleSearchInputChange}
                ref={searchInputRef}
            />
            <div className="order__add">
                {searchResults.map(product => (
                    <li
                        key={product.id}
                        onClick={() => addProductToOrder(product.id, product.name)}
                    >
                        {product.name} {product.price} тг.
                    </li>
                ))}
            </div>

            <div className="checkout__price">
                Общая стоимость: <br/> {totalPrice} тг {/* Вывод общей стоимости */}
                - 5% = {totalPrice*0.95} тг. {/* Вывод общей стоимости */}

            </div>

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
            <button
                className="checkout__btn"
                onClick={deleteOrder}
            >
                Удалить заказ
            </button>
            <Link className="checkout__btn" to="/orders">Вернуться к списку заказов</Link>
        </div>
    );
}


export default ProductInfo;
