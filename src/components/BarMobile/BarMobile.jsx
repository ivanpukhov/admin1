import {NavLink} from "react-router-dom";
import homeActive from "../../assets/img/bar/home__active.svg";
import homeBtn from "../../assets/img/bar/home.svg";
import catalogActive from "../../assets/img/bar/catalog__active.svg";
import catalogBtn from "../../assets/img/bar/catalog.svg";
import favoriteActive from "../../assets/img/bar/favorite__active.svg";
import favoriteBtn from "../../assets/img/bar/favorite.svg";
import shopActive from "../../assets/img/bar/shop__active.svg";
import shopBtn from "../../assets/img/bar/shop.svg";
import React from "react";

const BarMobile = () => {
    return(
        <div className="barMobile dn">
            <div className="barMobile__item">
                <NavLink to="/">
                    {({isActive}) => (<img src={isActive ? homeActive : homeBtn} alt="Home"/>)}
                </NavLink>
            </div>
            <div className="barMobile__item">
                <NavLink to="/products">
                    {({isActive}) => (<img src={isActive ? catalogActive : catalogBtn} alt="Home"/>)}
                </NavLink>
            </div>
            <div className="barMobile__item">
                <NavLink to="/products/add">
                    {({isActive}) => (<img src={isActive ? favoriteActive : favoriteBtn} alt="Home"/>)}
                </NavLink>
            </div>
            <div className="barMobile__item">
                <NavLink to="/orders">
                    {({isActive}) => (<img src={isActive ? shopActive : shopBtn} alt="Home"/>)}
                </NavLink>
            </div>


        </div>


    )
}

export default BarMobile
