import logo from "../../assets/img/logo.svg";
import cart from "../../assets/img/cart.svg";
import hum from "../../assets/img/hum.svg";
import favorite from "../../assets/img/favorite.svg";
import Search from "./Search";
import {Link} from "react-router-dom";

const Header = () => {
    return(
        <header className="header">
            <div className="header__container">

                    <Search />
            </div>
        </header>


    )
}

export default Header
