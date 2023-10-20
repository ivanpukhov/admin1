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
import NotCart from "../NotFound/NotCart";
import InputMask from 'react-input-mask';

const Checkout = () => {
    const [invalidFields, setInvalidFields] = React.useState({});

    const {cart, userInfo, removeFromCart, updateQuantity, updateUserInfo, setCart} = useCart();
    const navigate = useNavigate();
    const validateFields = () => {
        let newInvalidFields = {...invalidFields}; // Создаем копию текущего стейта

        if (userInfo.address) delete newInvalidFields.address; // Удаляем из invalidFields, если поле заполнено
        else newInvalidFields.address = true; // Добавляем в invalidFields, если поле пустое

        if (userInfo.firstName) delete newInvalidFields.firstName;
        else newInvalidFields.firstName = true;

        if (userInfo.lastName) delete newInvalidFields.lastName;
        else newInvalidFields.lastName = true;

        if (userInfo.phoneNumber) delete newInvalidFields.phoneNumber;
        else newInvalidFields.phoneNumber = true;

        if (userInfo.deliveryMethod) delete newInvalidFields.deliveryMethod;
        else newInvalidFields.deliveryMethod = true;

        setInvalidFields(newInvalidFields);

        return Object.keys(newInvalidFields).length === 0;
    };


    const handleRadioChange = (e) => {
        const {name, value} = e.target;

        // Обновляем информацию о пользователе
        updateUserInfo(name, value);

        // Проверяем, является ли радио-кнопка недействительной, и если да, удаляем её из invalidFields
        if (invalidFields[name]) {
            const newInvalidFields = {...invalidFields};
            delete newInvalidFields[name];
            setInvalidFields(newInvalidFields);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        // Обновляем информацию о пользователе
        updateUserInfo(name, value);

        // Проверяем, является ли поле недействительным, и если да, удаляем его из invalidFields
        if (invalidFields[name]) {
            const newInvalidFields = {...invalidFields};
            delete newInvalidFields[name];
            setInvalidFields(newInvalidFields);
        }
    };



    const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);


    const handleSubmit = async () => {


        const orderData = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
            paymentMethod: "kaspi",
            deliveryMethod: userInfo.deliveryMethod,
            products: cart.map((item) => ({
                id: item.id, quantity: item.quantity,
            })),
        };

        if (!validateFields()) {
            console.log("Validation failed");
            return; // Останавливаем отправку формы
        }

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

    return (
        <>
            {cart.length === 0 ? (<NotCart/>) : (<>
                <div className="checkout">
                    <div className="checkout__left">
                        <div className="checkout__title">Оформление заказа</div>
                        <div className="checkout__delivery">
                            <div className="checkout__subtitle">
                                Условия доставки
                            </div>
                            <div
                                className={`checkout__form ${invalidFields.deliveryMethod ? "invalid__label" : ""}`}
                            >
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
                                    required

                                    type="text"
                                    className={`checkout__input-item ${invalidFields.address ? "invalid" : ""}`}
                                    name="address"
                                    value={userInfo.address}
                                    onChange={handleInputChange}
                                    placeholder={` ${invalidFields.phoneNumber ? "Введите адрес " : "Адрес"}` }


                                />
                            </div>
                            <div className="checkout__input">
                                <input
                                    type="text" required

                                    className={`checkout__input-item ${invalidFields.firstName ? "invalid" : ""}`}
                                    placeholder={` ${invalidFields.phoneNumber ? "Введите имя " : "Имя"}` }

                                    name="firstName"
                                    value={userInfo.firstName}
                                    onChange={handleInputChange}

                                />
                            </div>
                            <div className="checkout__input">
                                <input
                                    required

                                    type="text"
                                    className={`checkout__input-item ${invalidFields.lastName ? "invalid" : ""}`}
                                    placeholder={` ${invalidFields.phoneNumber ? "Введите фамилию " : "Фамилия"}` }

                                    name="lastName"
                                    value={userInfo.lastName}
                                    onChange={handleInputChange}

                                />
                            </div>
                            <div className="checkout__input">
                                <InputMask
                                    required

                                    mask="+7 (999) 999-99-99"
                                    // maskChar={null}
                                    className={`checkout__input-item ${invalidFields.phoneNumber ? "invalid" : ""}`}
                                    placeholder={` ${invalidFields.phoneNumber ? "Введите номер телефона " : "Номер телефона"}` }
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
                                    id='delevery__kaspi'
                                    value="kaspi"
                                    checked={true}
                                    onChange={handleRadioChange} // Обработчик
                                />

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

                        <div className='cart'>
                            {cart.map((item) => (<div className='cart__item' key={item.id}>
                                    <div className="cart__top">
                                        <div className="cart__photo">
                                            <img src={'/api' + item.imageUrl} alt=""/>
                                        </div>
                                        <div className="cart__content">

                                            <div className="cart__name">
                                                <div className="cart__name-item">
                                                    {item.name}
                                                </div>
                                                <div className='cart__delete' onClick={() => removeFromCart(item.id)}>
                                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M15 15L23.75 23.75M15 15L6.25 6.25M15 15L6.25 23.75M15 15L23.75 6.25"
                                                            stroke="#989896" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>

                                                </div>

                                            </div>
                                            <div className="cart__price">
                                                <div className="cart__price-input">
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        min="1"
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="cart__price-text">
                                                    {item.price * item.quantity} ₸
                                                </div>


                                            </div>

                                        </div>

                                    </div>
                                    <div className="cart__price-mobile">
                                        <div className="cart__price-input">
                                            <input
                                                type="text"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="cart__price-text">
                                            {item.price * item.quantity} ₸
                                        </div>
                                        <div className='cart__delete-mobile' onClick={() => removeFromCart(item.id)}>
                                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M15 15L23.75 23.75M15 15L6.25 6.25M15 15L6.25 23.75M15 15L23.75 6.25"
                                                    stroke="#989896" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>

                                        </div>
                                    </div>
                                </div>

                            ))}

                        </div>
                        <div className="checkout__price-small">
                            <div className="checkout__price-left"> Товаров: {totalItems}. На сумму</div>
                            <div className="checkout__price-right">{totalCost} ₸</div>
                        </div>
                        <div className="checkout__price">
                            <div className="checkout__price-left">Итоговая цена (-5%)</div>
                            <div className="checkout__price-right">{totalCost*0.95} ₸</div>
                        </div>
                        <div className="checkout__btn" onClick={handleSubmit}>
                            Купить
                        </div>
                    </div>
                </div>
            </>)}
        </>

    );

};

export default Checkout;
