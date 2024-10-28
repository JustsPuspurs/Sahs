import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const Login = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        Inertia.post('/login', { username, password }, {
            onSuccess: () => {
                onClose(); // Close the modal on successful login
                Inertia.visit('/'); // Refresh or redirect after login
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="login-modal">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default Login;
