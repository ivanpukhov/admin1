import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartInitialized, setCartInitialized] = useState(false);
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        paymentMethod: '',
        deliveryMethod: ''
    });

    useEffect(() => {
        if (!isCartInitialized) {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
            setCartInitialized(true);
        }

        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }
    }, [isCartInitialized]);

    useEffect(() => {
        if (isCartInitialized) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isCartInitialized]);

    useEffect(() => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }, [userInfo]);

    const addToCart = (product) => {
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
            const updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
    };

    const updateQuantity = (productId, newQuantity) => {
        const updatedCart = cart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
    };

    const updateUserInfo = (field, value) => {
        setUserInfo({
            ...userInfo,
            [field]: value
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                userInfo,
                updateUserInfo
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
