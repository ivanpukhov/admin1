import React, {useEffect, useState} from "react";
import axios from "axios";
import Products from "./Products/Products";
import {ClipLoader} from "react-spinners";

const CategoryProducts = (props) => {
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(30);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");

    useEffect(() => {
        const apiURL = `/api/products/`;
        axios.get(apiURL)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [props.rout]);


    useEffect(() => {
        const apiURL = `api/products/category/${props.rout}/subcategories`;
        axios.get(apiURL)
            .then(response => {
                setSubcategories(response.data);
            })
            .catch(err => {
                console.error("Failed to fetch subcategories:", err);
            });
    }, [props.rout]);

    const filterProducts = (event) => {
        setSelectedSubcategory(event.target.value);
    };

    const displayedProducts = products
        .filter(product => selectedSubcategory === "all" ? true : product.subcategory === selectedSubcategory)
        .slice(0, visibleProducts);
    if (loading) {
        return (<div className="dacc">
            <ClipLoader color="#0CE3CB" loading={loading} size={50}/>
        </div>);
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (

        <>
            <div className="block__title">{props.title}</div>
            <form onChange={filterProducts} className="subcategories">
                <input type="radio" id="all-subcategories" name="subcategory" value="all"
                       checked={selectedSubcategory === "all"} onChange={() => {
                }}/>
                <label htmlFor="all-subcategories"
                       style={{
                           background: selectedSubcategory === "all" ? "#0CE3CB" : "#F1F1F1",
                           color: selectedSubcategory === "all" ? "#FFF" : "#060606"
                       }}>Все
                </label>
                {subcategories.map((subcategoryObj, index) => (<div key={index}>
                    <input type="radio" id={`subcategory-${index}`} name="subcategory"
                           value={subcategoryObj.subcategory} onChange={() => {
                    }}/>
                    <label htmlFor={`subcategory-${index}`}
                           style={{
                               background: selectedSubcategory === subcategoryObj.subcategory ? "#0CE3CB" : "#F1F1F1",
                               color: selectedSubcategory === subcategoryObj.subcategory ? "#FFF" : "#060606"
                           }}>
                        {subcategoryObj.subcategory}
                    </label>
                </div>))}
            </form>
            <Products products={displayedProducts}/>
            {visibleProducts < products.length && (<button
                onClick={() => setVisibleProducts(visibleProducts + 30)}
                className="show-more-button"
            >
                Показать ещё
            </button>)}
        </>);
};

export default CategoryProducts;
