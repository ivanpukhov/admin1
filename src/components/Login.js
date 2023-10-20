// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const { login } = useAuth();  // Получение функции login из AuthContext
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', credentials);
            if (response.status === 200) {
                localStorage.setItem('jwtToken', response.data.accessToken);
                login();  // Вызов функции login после успешного входа
                navigate('/products');
            } else {
                alert('Login failed: ' + response.data);
            }
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert('Login failed: ' + error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                alert('Login failed: Server did not respond');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Login failed: ' + error.message);
            }
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
