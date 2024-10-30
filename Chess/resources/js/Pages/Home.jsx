import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import ChessBoard from './ChessBoard';
import '../../css/Styles/Home.css';
import Register from './Register';
import Login from './Login';

const Home = () => {
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);
    const { auth, flash } = usePage().props; // Retrieve auth data and flash messages

    const openRegister = () => setRegisterOpen(true);
    const closeRegister = () => setRegisterOpen(false);

    const openLogin = () => setLoginOpen(true);
    const closeLogin = () => setLoginOpen(false);

    const handleLogout = () => {
        Inertia.post('/logout');
    };

    return (
        <div className="app">
            <div className="navbar">
                {auth?.user ? (
                    <>
                        <span>Welcome, {auth.user.username}</span>
                        <button type="button" onClick={handleLogout} className="nav-link">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={openRegister} className="nav-link">Register</button>
                        <button onClick={openLogin} className="nav-link">Login</button>
                    </>
                )}
            </div>

            {flash?.success && <div className="flash-message success">{flash.success}</div>}
            {flash?.error && <div className="flash-message error">{flash.error}</div>}

            {isLoginOpen && <Login isOpen={isLoginOpen} onClose={closeLogin} />}
            {isRegisterOpen && <Register isOpen={isRegisterOpen} onClose={closeRegister} />}

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
