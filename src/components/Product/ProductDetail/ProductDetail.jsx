import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import './detail.css';
import ProductDelete from "../../ProductDelete";

const ProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Проверить, находится ли товар в избранном


    // Загрузка данных о товаре
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwtToken');

            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                setProduct(response.data);
            } catch (err) {
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAvailabilityChange = async (e) => {
        const isAvailable = e.target.checked ? 1 : 0; // Преобразование состояния чекбокса в значение для isAvailable
        try {
            await axios.put(`/api/products/${id}`, { ...product, isAvailable }); // Отправка обновленного состояния на сервер
            setProduct({ ...product, isAvailable }); // Обновление состояния продукта
        } catch (error) {
            console.error('Error updating product availability:', error);
        }
    };
    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (<div className='detail_pc'>
        <div className="detail">
            <div className="detail__bar">
                <div className='detail__back' onClick={handleGoBack}>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="44" height="44" rx="10" fill="#C6ECE8"/>
                        <path d="M26.2188 13.5625L17.7812 22L26.2188 30.4375" stroke="#0CE3CB" strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="detail__title">
                    {product.name}
                </div>
                <div className="detail__favorite">
                    <div>
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <rect width="44" height="44" rx="10" fill="#C6ECE8"/>
                            <path
                                d="M26.6875 12.625C24.8041 12.625 23.1325 13.3684 22 14.6463C20.8675 13.3684 19.1959 12.625 17.3125 12.625C15.6721 12.627 14.0994 13.2795 12.9395 14.4395C11.7795 15.5994 11.127 17.1721 11.125 18.8125C11.125 25.5944 21.0447 31.0131 21.4666 31.2409C21.6305 31.3292 21.8138 31.3754 22 31.3754C22.1862 31.3754 22.3695 31.3292 22.5334 31.2409C22.9553 31.0131 32.875 25.5944 32.875 18.8125C32.873 17.1721 32.2205 15.5994 31.0605 14.4395C29.9006 13.2795 28.3279 12.627 26.6875 12.625ZM17 15.5C15.6943 16.608 22.4714 26.6239 21 27.5C19.5286 26.6239 19.1329 27.0792 17.8272 25.9713C19.5 28.9525 22 30.5994 22 27.8413C22 26.797 21.2616 29.2384 22 28.5C20.9557 28.5 22.7384 27.7616 22 28.5C23.6687 28.5 24.3873 16.1568 20.9584 17.1756C21.0429 17.3825 21.1871 17.5596 21.3726 17.6842C21.5581 17.8089 16.7765 15.5 17 15.5C17.2235 15.5 17 15.5 22.6274 17.6842C22.6274 17.6842 22.9571 17.3825 23.0416 17.1756C23.6219 15.7562 29.3918 17.8755 31.0605 17.8755C32.1048 17.8755 28.7333 15.2898 29.4717 16.0283C30.2102 16.7667 2.83344 14.7835 20.9584 17.5678C20.9584 20.3259 19.0316 13.7572 17 15.5Z"
                                fill="#0CE3CB"/>
                        </svg>
                    </div>

                </div>
            </div>
            <div className="detail__content">
                <div className="detail__photo">
                    <img src={'/api' + product.imageUrl} alt={product.name}/>
                </div>
                <div className="detail__name">
                    {product.name}
                </div>
                <div className="detail__price">
                    <div className="detail__price-small">
                        При покупке на сайте
                    </div>
                    <div className="detail__price-content">
                        <div className="detail__price-price">
                            {product.price * 0.95} ₸
                        </div>
                        <div className="detail__price-procent">
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="20" rx="3" fill="#0CE3CB"/>
                                <path
                                    d="M11.3921 9.9V10.86H7.28211V9.9H11.3921ZM17.5617 7.69H14.2117V9.68C14.3517 9.49333 14.5584 9.33667 14.8317 9.21C15.1117 9.08333 15.4084 9.02 15.7217 9.02C16.2817 9.02 16.7351 9.14 17.0817 9.38C17.4351 9.62 17.6851 9.92333 17.8317 10.29C17.9851 10.6567 18.0617 11.0433 18.0617 11.45C18.0617 11.9433 17.9651 12.3833 17.7717 12.77C17.5851 13.15 17.3017 13.45 16.9217 13.67C16.5484 13.89 16.0884 14 15.5417 14C14.8151 14 14.2317 13.82 13.7917 13.46C13.3517 13.1 13.0884 12.6233 13.0017 12.03H14.1117C14.1851 12.3433 14.3484 12.5933 14.6017 12.78C14.8551 12.96 15.1717 13.05 15.5517 13.05C16.0251 13.05 16.3784 12.9067 16.6117 12.62C16.8517 12.3333 16.9717 11.9533 16.9717 11.48C16.9717 11 16.8517 10.6333 16.6117 10.38C16.3717 10.12 16.0184 9.99 15.5517 9.99C15.2251 9.99 14.9484 10.0733 14.7217 10.24C14.5017 10.4 14.3417 10.62 14.2417 10.9H13.1617V6.69H17.5617V7.69ZM19.0684 8.47C19.0684 7.98333 19.2084 7.60333 19.4884 7.33C19.7751 7.05 20.1418 6.91 20.5884 6.91C21.0351 6.91 21.3984 7.05 21.6784 7.33C21.9651 7.60333 22.1084 7.98333 22.1084 8.47C22.1084 8.95667 21.9651 9.34 21.6784 9.62C21.3984 9.9 21.0351 10.04 20.5884 10.04C20.1418 10.04 19.7751 9.9 19.4884 9.62C19.2084 9.34 19.0684 8.95667 19.0684 8.47ZM25.1684 7.04L21.1784 14H20.0584L24.0484 7.04H25.1684ZM20.5884 7.6C20.1684 7.6 19.9584 7.89 19.9584 8.47C19.9584 9.05667 20.1684 9.35 20.5884 9.35C20.7884 9.35 20.9418 9.28 21.0484 9.14C21.1618 8.99333 21.2184 8.77 21.2184 8.47C21.2184 7.89 21.0084 7.6 20.5884 7.6ZM23.1384 12.56C23.1384 12.0733 23.2784 11.6933 23.5584 11.42C23.8451 11.14 24.2118 11 24.6584 11C25.0984 11 25.4584 11.14 25.7384 11.42C26.0251 11.6933 26.1684 12.0733 26.1684 12.56C26.1684 13.0467 26.0251 13.43 25.7384 13.71C25.4584 13.99 25.0984 14.13 24.6584 14.13C24.2118 14.13 23.8451 13.99 23.5584 13.71C23.2784 13.43 23.1384 13.0467 23.1384 12.56ZM24.6484 11.69C24.2284 11.69 24.0184 11.98 24.0184 12.56C24.0184 13.14 24.2284 13.43 24.6484 13.43C25.0684 13.43 25.2784 13.14 25.2784 12.56C25.2784 11.98 25.0684 11.69 24.6484 11.69Z"
                                    fill="white"/>
                            </svg>
                        </div>
                        <div className="detail__price-line">
                            {product.price} ₸
                        </div>
                    </div>

                </div>
            </div>
            <div className="detail__about">
                <div className="detail__about-title">
                    О товаре
                </div>
                <div className="detail__price-text">
                    {product.description}
                </div>
            </div>
            <p className="detail__price-text">Наличие
                <input
                    type="checkbox"
                    checked={product.isAvailable === 1} // Установка состояния чекбокса на основе isAvailable
                    onChange={handleAvailabilityChange} // Привязка обработчика изменения
                />
            </p>
            <ProductDelete productId={id} />


            <Link to={`/products/${id}/edit`} className="detail__btn ">
                Изменить товар
            </Link>

        </div>

    </div>);
};

export default ProductDetail;
