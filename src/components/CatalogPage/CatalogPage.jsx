import React from "react";
import {Link} from "react-router-dom";
import './catalog.css'
import OrderStatistics from "../OrderStatistics";
const CatalogPage = () => {
    return (
        <div className="catalogPage">
            <div className="catalog__title">Miko.kz</div>
            <OrderStatistics />
        </div>)
}

export default CatalogPage
