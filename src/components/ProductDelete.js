import React from 'react';
import axios from 'axios';
import './Product/ProductDetail/detail.css';

function ProductDelete({productId}) {
    const handleDelete = async () => {
        const token = localStorage.getItem('jwtToken');
        axios.delete('/api/products/' + productId, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(response => {
                console.log('Product deleted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error during product deletion:', error);
            });
    };

    return (<div className="detail__btn " onClick={handleDelete}>Удалить товар</div>);
}

export default ProductDelete;
