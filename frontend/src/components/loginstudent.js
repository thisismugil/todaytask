import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoginStudent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const firstName = localStorage.getItem('first_name');
        const lastName = localStorage.getItem('last_name');

        if (token && firstName && lastName) {
            // User is logged in, redirect to the landing page
            history.push('/landing');
        }
    }, [history]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8000/api/student/login/', { // Update the URL to match your backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save the token and user info in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('first_name', data.first_name);
            localStorage.setItem('last_name', data.last_name);
            alert('Login successful!');
            // Redirect to the landing page
            history.push('/landing');
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="login-container">
            <style>
                {`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .login-container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    width: 300px;
                }
                .login-container h1 {
                    margin-bottom: 20px;
                    font-size: 24px;
                    text-align: center;
                }
                .login-container label {
                    display: block;
                    margin-bottom: 5px;
                }
                .login-container input {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .login-container button {
                    width: 100%;
                    padding: 10px;
                    background-color: #28a745;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    font-size: 16px;
                    cursor: pointer;
                }
                .login-container button:hover {
                    background-color: #218838;
                }
                `}
            </style>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginStudent;