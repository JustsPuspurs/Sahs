import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ReactDOM from 'react-dom';

const Register = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const { data, setData, post, processing } = useForm({
        username: '',
        password: '',
        password_confirmation: ''
    });

    const { errors } = usePage().props;

    const handleChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setData(key, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                onClose();
            },
        });
    };
    

    return ReactDOM.createPortal(
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>
                    <div>
                        <label htmlFor="password_confirmation">Confirm Password:</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={processing}>Register</button>
                </form>
            </div>
        </div>,
        document.body // Render the modal to the end of the body using a Portal
    );
};

export default Register;
