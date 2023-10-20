import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import axios from "axios";
import Products from "../Products/Products";
import qs from 'query-string';
import {ClipLoader} from "react-spinners";  // Импортирование индикатора загрузки

const SearchResult = () => {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(30);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const {query} = qs.parse(location.search);

        // Замените этот URL вашим реальным адресом API
        const apiURL = `/api/products/search?q=${query}`;

        axios.get(apiURL)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [location.search]);

    if (loading) {
        return (
            <div className="dacc">
                <ClipLoader color="#0CE3CB" loading={loading} size={50}/>

            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    // Отфильтровать продукты
    const displayedProducts = products.slice(0, visibleProducts);

    return (
        <>
            <div className="block__title">Результаты поиска</div>
            <Products products={displayedProducts}/>
            {visibleProducts < products.length && (
                <button
                    onClick={() => setVisibleProducts(visibleProducts + 30)}
                    className="show-more-button"
                >
                    Показать ещё
                </button>
            )}
        </>
    );
};

export default SearchResult;
