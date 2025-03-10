import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const Register = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { errors } = usePage().props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage(''); // Clear previous success message
    Inertia.post('/register', { username, password, password_confirmation }, {
      onSuccess: () => {
        setSuccessMessage('Registration successful!'); // Set success message
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        // Optionally close modal after a short delay
        setTimeout(() => {
          onClose && onClose();
          setSuccessMessage(''); // Clear message after closing modal
        }, 1500);
      },
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="close-button-container">
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <h2>Register</h2>
        {successMessage && <div className="success-message">{successMessage}</div>} {/* Success message */}
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
            {errors.username && <div className="error-message">{errors.username}</div>}
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
            {Array.isArray(errors.password) ? (
              errors.password
                .filter(error => !error.includes("confirmation does not match"))
                .map((error, index) => (
                  <div key={index} className="error-message">{error}</div>
                ))
            ) : (
              errors.password && <div className="error-message">{errors.password}</div>
            )}
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
            {Array.isArray(errors.password) &&
              errors.password.some(error => error.includes("confirmation does not match")) && (
                <div className="error-message">
                  The password field confirmation does not match.
                </div>
            )}
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;