import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Product/CartContext";  // Импортировать ваш контекст корзины

const Product = ({ product }) => {


    return (
        <Link  to={`/products/${product.id}`} key={product.id} className="product">
            <div className="product__photo">
                <img src={'/api' + product.imageUrl} alt="" />
            </div>
            <div className="product__content">
                <div className="product__title">{product.name}</div>
                <div className="product__price">{product.price} <span>₸</span></div>
            </div>
            <Link to={`/products/${product.id}`} className="product__btn">
                Детали товара
            </Link>
        </Link>
    );
};

export default Product;
