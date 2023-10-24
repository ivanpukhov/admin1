import React from "react";
import {Link} from "react-router-dom";
import './catalog.css'
const CatalogPage = () => {
    return (
        <div className="catalogPage">
            <div className="catalog__title">Miko.kz</div>
            <div className="catalogPage__block">
                <Link to="/products/add" className="catalogPage__item ">Добавить продукт</Link>
                <Link to="/products" className="catalogPage__item ">Перейти к продуктам</Link>
                <Link to="/orders" className="catalogPage__item ">Заказы</Link>
                <Link to="/statistic" className="catalogPage__item ">Статистика</Link>
            </div>
        </div>)
}

export default CatalogPage
