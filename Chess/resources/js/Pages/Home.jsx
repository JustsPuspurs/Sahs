import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import ChessBoard from './ChessBoard';
import '../../css/Styles/Home.css'; 
import Register from './Register';

const Home = () => {
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const { props } = usePage();
    const { errors = {}, flash = {} } = props;

    const openRegister = () => setRegisterOpen(true);
    const closeRegister = () => setRegisterOpen(false);

    console.log("Rendering Home component...");

    return (
        <div className="app">
            <div className="navbar">
                <a onClick={openRegister}>Register</a>
                <Register isOpen={isRegisterOpen} onClose={closeRegister} />
                <a href="/" className="nav-link">Poga 2</a>
            </div>

            {flash?.success && (
                <div className="flash-message success">
                    {flash.success}
                </div>
            )}

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
