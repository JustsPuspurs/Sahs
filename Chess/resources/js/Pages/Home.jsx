import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import Login from "./Login";
import Register from "./Register";
import ChessBoard from "./ChessBoard";
import MoveList from "./GameHistory";
import RecordGameModal from "./RecordGameModal";
import Shop from "./Shop";
import "../../css/Styles/Home.css";

const Home = () => {
    // If flash is null, default it to an empty object.
    const { auth, flash, skins = [], wallet = { coins: 0 } } = usePage().props;
    const flashData = flash ?? {};
    const [ownedSkins, setOwnedSkins] = useState(
      auth.user && auth.user.skins ? auth.user.skins : []
    );    
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [moveHistory, setMoveHistory] = useState([]);
    const tileSize = 50;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playerTotalTime, setPlayerTotalTime] = useState(0);
    const [isShopOpen, setIsShopOpen] = useState(false);
    // Use local state for coins so you can update after a purchase.
    const [localCoins, setLocalCoins] = useState(wallet.coins);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleShopClose = () => {
        setIsShopOpen(false);
    };

    const handleSkinPurchase = (cost) => {
        // Deduct cost from local coin balance
        setLocalCoins(prev => prev - cost);
    };

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    return (
        <div className="app">
            <div className="navbar">
                {auth.user ? (
                    <>
                        <span>Welcome, {auth.user.username}</span>
                        <button onClick={handleLogout}>Logout</button>
                        <button onClick={() => setIsShopOpen(true)}>Shop</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setRegisterOpen(true)}>Register</button>
                        <div className="divider"></div>
                        <button onClick={() => setLoginOpen(true)}>Login</button>
                    </>
                )}
            </div>
            {flashData.message && <div>{flashData.message}</div>}
            {isLoginOpen && (
                <Login
                    isOpen={isLoginOpen}
                    onClose={() => setLoginOpen(false)}
                />
            )}
            {isRegisterOpen && (
                <Register
                    isOpen={isRegisterOpen}
                    onClose={() => setRegisterOpen(false)}
                />
            )}
            <div className="content">
                {auth.user ? (
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "flex-start",
                            justifyContent: "center",
                        }}
                    >
                        <div>
                            <div className="chess-container">
                                <div className="column-labels">
                                    {["A", "B", "C", "D", "E", "F", "G", "H"].map(
                                        (label, index) => (
                                            <div key={index} className="column-label">
                                                {label}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="row-labels">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((label, index) => (
                                        <div key={index} className="row-label">
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <ChessBoard
                                    moveHistory={moveHistory}
                                    setMoveHistory={setMoveHistory}
                                    setPlayerTotalTime={setPlayerTotalTime}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                width: "200px",
                                height: 8 * tileSize,
                                overflowY: "auto",
                                backgroundColor: "rgba(46,46,46,0.8)",
                                padding: "10px",
                                border: "2px solid #444",
                                color: "#fff",
                            }}
                        >
                            <MoveList moves={moveHistory} />
                            <RecordGameModal
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                                computedTime={playerTotalTime}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>Welcome to Chess Game</h1>
                        <p>Please log in or register to start playing!</p>
                    </div>
                )}
            </div>
            {isShopOpen && (
                <Shop
                    isOpen={isShopOpen}
                    onClose={handleShopClose}
                    skins={skins}
                    walletCoins={localCoins}
                    onPurchase={handleSkinPurchase}
                />
            )}
        </div>
    );
};

export default Home;