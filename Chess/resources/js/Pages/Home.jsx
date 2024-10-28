import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import ChessBoard from './ChessBoard'; // Assuming you have a ChessBoard component
import Login from "./Login";
import Register from "./Register";
import '../../css/Styles/Home.css';

const Home = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { auth, flash } = usePage().props || {};

    const handleLogout = () => {
        Inertia.post('/logout');
    };

    return (
        <div className="app">
            <div className="navbar">
                {auth && auth.user ? (
                    <>
                        <span>Welcome, {auth.user.username}</span>
                        <button onClick={handleLogout} className="nav-link">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setShowLogin(true)} className="nav-link">Login</button>
                        <button onClick={() => setShowRegister(true)} className="nav-link">Register</button>
                    </>
                )}
            </div>

            {flash?.success && <div className="flash-message">{flash.success}</div>}

            {showLogin && <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />}
            {showRegister && <Register isOpen={showRegister} onClose={() => setShowRegister(false)} />}

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
