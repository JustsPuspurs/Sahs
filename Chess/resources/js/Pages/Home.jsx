import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Login from './Login';
import Register from './Register';
import ChessBoard from './ChessBoard';
import '../../css/Styles/Home.css';

const Home = () => {
  // This hook can only be called inside components that are descendants of an Inertia App component.
  const { flash, auth } = usePage().props;
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const handleLogout = () => {
    Inertia.post('/logout');
  };

  return (
    <div className="app">
      <div className="navbar">
        {auth.user ? (
          <>
            <span>Welcome, {auth.user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setRegisterOpen(true)}>Register</button>
            <button onClick={() => setLoginOpen(true)}>Login</button>
          </>
        )}
      </div>
      {flash.message && <div>{flash.message}</div>}
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />}
      {isRegisterOpen && <Register isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} />}
      <div className="content">
        <div className="grid-container">
          <div className="column-labels">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, index) => (
              <div key={index} className="label-column">{label}</div>
            ))}
          </div>
          <div className="row-wrapper">
            <div className="row-labels">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((label, index) => (
                <div key={index} className="label-row">{label}</div>
              ))}
            </div>
            <ChessBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
