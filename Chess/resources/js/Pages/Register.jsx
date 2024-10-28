import React, { useState } from 'react';

const Register = ({ isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (event) => {
    event.preventDefault();
    console.log('Registering:', userDetails);
    // Here, you would typically handle the registration logic, possibly making an HTTP request to your server
    // For now, simulate successful registration
    alert("Registration successful!");
    onClose(); // Close modal on successful registration
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <label>
            Username:
            <input type="text" name="username" value={userDetails.username} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={userDetails.password} onChange={handleChange} required />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
