import React, {useContext} from 'react';
import {FavoritesContext} from './FavoritesContext'; // Путь до вашего FavoritesContext
import NotFavorite from "../NotFound/NotFavorite";  // Убедитесь, что путь правильный
import './Favorite.css'
const FavoriteProducts = () => {
    const {favoriteProducts, removeFromFavorites} = useContext(FavoritesContext);

    if (favoriteProducts.length === 0) {
        return <NotFavorite/>;
    }

    return (<div className="favorite">
        <div className="favorite__title">Избранные товары</div>
        <div className="favorite__box">
            {favoriteProducts.map((product) => (<div className="favorite__item" key={product.id}>
                <div className="favorite__photo">
                    <img src={'/api' + product.imageUrl} alt=""/>
                </div>
                <div className="favorite__content">
                    <div className="favorite__name">
                        {product.name}
                    </div>
                    <div className="favorite__price">
                        <div className="favorite__price-line">{product.price} ₸</div>
                        <div className="favorite__price-item">{product.price*0.95} ₸</div>
                    </div>
                    <div className="favorite__btns">
                        <div className="favorite__delete" onClick={() => removeFromFavorites(product.id)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12L19 19M12 12L5 5M12 12L5 19M12 12L19 5" stroke="#989896" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div className="favorite__btn">В корзину</div>
                    </div>
                </div>
            </div>))}
        </div>
    </div>);
};

export default FavoriteProducts;
