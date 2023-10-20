import React from 'react';
import {useCart} from './CartContext';
import {Link, useNavigate} from 'react-router-dom';
import shop from './img/shop.svg'
import yes from './img/yes.svg'
import no from './img/no.svg'
import nal from './img/nal.svg'
import kaspi from './img/kaspi.svg'
import adress from './img/adress.svg'
import './cart.css'
import axios from 'axios';

const Checkout = () => {
    const {cart, userInfo, updateUserInfo, setCart} = useCart();
    const navigate = useNavigate();
    const handleRadioChange = (e) => {
        const {name, value} = e.target;
        updateUserInfo(name, value);
    };
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        updateUserInfo(name, value);
    };


    const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);


    const handleSubmit = async () => {
        const orderData = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
            paymentMethod: userInfo.paymentMethod,
            deliveryMethod: userInfo.deliveryMethod,
            products: cart.map((item) => ({
                id: item.id, quantity: item.quantity,
            })),
        };

        try {
            const response = await axios.post('/api/orders/', orderData);

            if (response.status === 200) {
                console.log('Order created successfully:', response.data);
                setCart([]);  // Очистка корзины после успешного создания заказа
                navigate('/order-success');  // Перенаправление пользователя на страницу с подтверждением заказа
            } else {
                console.error('Failed to create order:', response.data);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (<div className="checkout">
        <div className="checkout__left">
            <div className="checkout__title">Оформление заказа <span><Link
                to={'/cart'}>вернуться в корзину</Link></span></div>
            <div className="checkout__delivery">
                <div className="checkout__subtitle">
                    Условия доставки
                </div>
                <div className="checkout__form">
                    <input
                        type="radio"
                        className='sdn'
                        name='deliveryMethod'
                        value="delevery_shop"
                        id='delevery__shop'
                        checked={userInfo.deliveryMethod === "delevery_shop"}
                        onChange={handleRadioChange} // Обработчик
                    />
                    <input
                        type="radio"
                        className='sdn'
                        name='deliveryMethod'
                        value='delevery_adress'
                        id='delevery__adress'
                        checked={userInfo.deliveryMethod === "delevery_adress"}
                        onChange={handleRadioChange} // Обработчик
                    />
                    <label htmlFor="delevery__shop" className='checkout__label checkout__label-shop'>
                        <div className="checkout__content">
                            <div className="checkout__label-icon">
                                <img src={shop} alt=""/>
                            </div>
                            <div className="checkout__label-text">
                                В магазине
                            </div>
                        </div>
                        <span className="checkout__yes">
                                <img src={yes} alt=""/>
                            </span>
                        <span className="checkout__no">
                                <img src={no} alt=""/>
                            </span>
                    </label>
                    <label htmlFor="delevery__adress" className='checkout__label checkout__label-adress'>
                        <div className="checkout__content">

                            <div className="checkout__label-icon">
                                <img src={adress} alt=""/>
                            </div>
                            <div className="checkout__label-text">
                                Доставка
                            </div>
                        </div>
                        <span className="checkout__yes">
                                <img src={yes} alt=""/>
                            </span>
                        <span className="checkout__no">
                                <img src={no} alt=""/>
                            </span>
                    </label>
                </div>
            </div>
            <div className="checkout__user">
                <div className="checkout__input">
                    <input
                        type="text"
                        className="checkout__input-item"
                        name="address"
                        value={userInfo.address}
                        onChange={handleInputChange}

                    />
                </div>
                <div className="checkout__input">
                    <input
                        type="text"
                        className="checkout__input-item"
                        placeholder="Имя"
                        name="firstName"
                        value={userInfo.firstName}
                        onChange={handleInputChange}

                    />
                </div>
                <div className="checkout__input">
                    <input
                        type="text"
                        className="checkout__input-item"
                        placeholder="Фамилия"
                        name="lastName"
                        value={userInfo.lastName}
                        onChange={handleInputChange}

                    />
                </div>
                <div className="checkout__input">
                    <input
                        type="text"
                        className="checkout__input-item"
                        placeholder="Номер телефона"
                        name="phoneNumber"
                        value={userInfo.phoneNumber}
                        onChange={handleInputChange}

                    />
                </div>
            </div>
            <div className="checkout__pay">
                <div className="checkout__subtitle">
                    Способ оплаты
                </div>
                <div className="checkout__form">
                    <input
                        type="radio"
                        className='sdn'
                        name='paymentMethod'
                        id='delevery__nal'
                        value="cash"
                        checked={userInfo.paymentMethod === "cash"}
                        onChange={handleRadioChange} // Обработчик
                    />
                    <input
                        type="radio"
                        className='sdn'
                        name='paymentMethod'
                        id='delevery__kaspi'
                        value="kaspi"
                        checked={userInfo.paymentMethod === "kaspi"}
                        onChange={handleRadioChange} // Обработчик
                    />
                    <label htmlFor="delevery__nal" className='checkout__label checkout__label-nal'>
                        <div className="checkout__content">

                            <div className="checkout__label-icon">
                                <img src={nal} alt=""/>
                            </div>
                            <div className="checkout__label-text">
                                Наличными
                            </div>
                        </div>
                        <span className="checkout__yes">
                                <img src={yes} alt=""/>
                            </span>
                        <span className="checkout__no">
                                <img src={no} alt=""/>
                            </span>

                    </label>
                    <label htmlFor="delevery__kaspi" className='checkout__label checkout__label-kaspi'>
                        <div className="checkout__content">

                            <div className="checkout__label-icon">
                                <img src={kaspi} alt=""/>
                            </div>
                            <div className="checkout__label-text">
                                Kaspi
                            </div>
                        </div>
                        <span className="checkout__yes">
                                <img src={yes} alt=""/>
                            </span>
                        <span className="checkout__no">
                                <img src={no} alt=""/>
                            </span>
                    </label>
                </div>
            </div>

        </div>
        <div className="checkout__right">
            <div className="checkout__price-small">
                <div className="checkout__price-left"> Товаров: {totalItems}. На сумму</div>
                <div className="checkout__price-right">{totalCost} ₸</div>
            </div>
            <div className="checkout__price">
                <div className="checkout__price-left">Итого</div>
                <div className="checkout__price-right">{totalCost} ₸</div>
            </div>
            <div className="checkout__btn" onClick={handleSubmit}>
                Купить
            </div>
        </div>
    </div>);
};

export default Checkout;
