import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './cart.css'
import {Link, useNavigate} from 'react-router-dom';

function ProductEdit() {
    const { id } = useParams();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        imageUrl: '',
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProductData(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };
    const navigate = useNavigate();


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedImageUrl = productData.imageUrl;
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const uploadResponse = await axios.post('/api/upload', formData);
                updatedImageUrl = `/uploads/${uploadResponse.data.file.filename}`;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        const updatedProduct = {
            ...productData,
            imageUrl: updatedImageUrl
        };

        const token = localStorage.getItem('jwtToken');


        try {
            await axios.put(`/api/products/${id}`, updatedProduct,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }})
            alert('Product updated successfully');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="">
            <div className="ordr">
                <div className='detail__back' onClick={handleGoBack}>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="44" height="44" rx="10" fill="#C6ECE8"/>
                        <path d="M26.2188 13.5625L17.7812 22L26.2188 30.4375" stroke="#0CE3CB" strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2>Редактировать товар</h2>

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

                    <input  className="checkout__input-item" type="text" name="category" value={productData.category} onChange={handleChange} required />
                </label>
                <label className="checkout__input">
                    <div>Подкатегория</div>

                    <input className="checkout__input-item" type="text" name="subcategory" value={productData.subcategory} onChange={handleChange} required />
                </label>
                <label className="checkout__input">
                    <div>Изображение</div>
                    <input type="file" onChange={handleFileChange} />
                </label>
                <button className="checkout__btn" type="submit">Обновить продукт</button>
            </form>
        </div>
    );
}

export default ProductEdit;
