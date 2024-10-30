// resources/js/Pages/Register.jsx

import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';

const Register = ({ isOpen, onClose }) => {
  const { errors } = usePage().props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    Inertia.post('/register', { username, password, password_confirmation }, {
      onSuccess: () => {
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        onClose && onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">&times;</button>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div>
            <label htmlFor="password_confirmation">Confirm Password:</label>
            <input
              id="password_confirmation"
              type="password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm Password"
            />
            {errors.password_confirmation && <div className="error">{errors.password_confirmation}</div>}
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;