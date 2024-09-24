import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Modal({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
}

function ProductAdd() {
    const [categories, setCategories] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        imageUrl: '',
        discont: 5, // По умолчанию скидка 5%, если не выбрана категория discont
    });
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        axios.get('/api/products/categories')
            .then(response => {
                setCategories(response.data.map(item => item.category));
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setModalMessage('Failed to fetch categories');
                setIsModalOpen(true);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setProductData({
            ...productData,
            category: value,
            discont: value === 'discont' ? 0 : 5, // Если выбрана категория discont, скидка по умолчанию 0, иначе 5
        });
        setShowSuggestions(true);
    };

    const handleCategoryClick = (category) => {
        setProductData({
            ...productData,
            category,
            discont: category === 'discont' ? 0 : 5, // Устанавливаем скидку в зависимости от категории
        });
        setShowSuggestions(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDiscountChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 0 && value <= 100) {
            setProductData({
                ...productData,
                discont: value
            });
        }
    };

    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploadResponse = await axios.post('/api/upload', formData);
            const product = {
                ...productData,
                imageUrl: `/uploads/${uploadResponse.data.file.filename}`
            };
            await axios.post('/api/products/many', [product], {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setModalMessage('Product added successfully');
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error during product addition:', error);
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Failed to add product';
            setModalMessage(errorMessage);
            setIsModalOpen(true);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="product-add">
            <div className="ordr">
                <div className='detail__back' onClick={handleGoBack}>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="44" height="44" rx="10" fill="#C6ECE8"/>
                        <path d="M26.2188 13.5625L17.7812 22L26.2188 30.4375" stroke="#0CE3CB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2>Добавить товар</h2>
            </div>
            <form className="checkout__user" onSubmit={handleSubmit}>
                <label className="checkout__input">
                    <div>Название товара</div>
                    <input className="checkout__input-item" type="text" name="name" value={productData.name} onChange={handleChange} required />
                </label>
                <label className="checkout__input">
                    <div>Описание</div>
                    <input className="checkout__input-item" type="text" name="description" value={productData.description} onChange={handleChange} required />
                </label>
                <label className="checkout__input">
                    <div>Цена</div>
                    <input className="checkout__input-item" type="number" name="price" value={productData.price} onChange={handleChange} required />
                </label>
                <label className="checkout__input">
                    <div>Категория</div>
                    <input
                        className="checkout__input-item"
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleCategoryChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        required
                    />
                    {showSuggestions && (
                        <ul className="order__add">
                            {categories.filter(cat => cat.includes(productData.category)).map((category, index) => (
                                <li key={index} onClick={() => handleCategoryClick(category)}>
                                    {category}
                                </li>
                            ))}
                        </ul>
                    )}
                </label>

                {productData.category === 'discont' && (
                    <label className="checkout__input">
                        <div>Скидка (%)</div>
                        <input
                            className="checkout__input-item"
                            type="number"
                            name="discont"
                            value={productData.discont}
                            onChange={handleDiscountChange}
                            min="0"
                            max="100"
                            required
                        />
                    </label>
                )}

                <label className="checkout__input">
                    <div>Подкатегория</div>
                    <input className="checkout__input-item" type="text" name="subcategory" value={productData.subcategory} onChange={handleChange} required />
                </label>
                <label className="checkout__input">
                    <div>Изображение</div>
                    <input type="file" onChange={handleFileChange} required />
                </label>
                <button className="checkout__btn" type="submit">Создать продукт</button>
            </form>
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default ProductAdd;
