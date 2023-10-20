import React, { createContext, useState, useEffect, useContext } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isFavoritesInitialized, setFavoritesInitialized] = useState(false);

    // Инициализация избранных товаров из localStorage
    useEffect(() => {
        if (!isFavoritesInitialized) {
            const savedFavoriteProducts = localStorage.getItem('favoriteProducts');
            if (savedFavoriteProducts) {
                setFavoriteProducts(JSON.parse(savedFavoriteProducts));
            }
            setFavoritesInitialized(true);
        }
    }, [isFavoritesInitialized]);

    // Сохранение избранных товаров в localStorage при изменении
    useEffect(() => {
        if (isFavoritesInitialized) {
            localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
        }
    }, [favoriteProducts, isFavoritesInitialized]);

    // Добавление товара в избранное
    const addToFavorites = (product) => {
        const existingProduct = favoriteProducts.find((item) => item.id === product.id);
        if (!existingProduct) {
            setFavoriteProducts([...favoriteProducts, product]);
        }
    };

    // Удаление товара из избранного
    const removeFromFavorites = (productId) => {
        const updatedFavorites = favoriteProducts.filter((item) => item.id !== productId);
        setFavoriteProducts(updatedFavorites);
    };

    return (
        <FavoritesContext.Provider
            value={{
                favoriteProducts,
                setFavoriteProducts,
                addToFavorites,
                removeFromFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
