import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const Login = ({ isOpen, onClose }) => {
  const { errors: serverErrors } = usePage().props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset previous errors.
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If validations pass, submit the form.
    Inertia.post('/login', { username, password }, {
      onSuccess: () => {
        setUsername('');
        setPassword('');
        setTimeout(() => {
          if (onClose) onClose();
        }, 500);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="close-button-container">
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <h2>Login</h2>
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
            {/* Display client-side error first, then server errors */}
            {errors.username && <div className="error-message">{errors.username}</div>}
            {!errors.username && serverErrors.username && <div className="error-message">{serverErrors.username}</div>}
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
            {errors.password && <div className="error-message">{errors.password}</div>}
            {!errors.password && serverErrors.password && <div className="error-message">{serverErrors.password}</div>}
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;