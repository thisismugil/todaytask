import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginStudent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8000/login_user/', {
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
            navigate('/landing');
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="login-container">
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