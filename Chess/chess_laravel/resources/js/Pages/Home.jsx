import React, { useState, useEffect, useRef } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import Login from "./Login";
import Register from "./Register";
import ChessBoard from "./ChessBoard";
import MoveList from "./MoveList";
import RecordGameModal from "./RecordGameModal";
import Shop from "./Shop";
import DataPopup from "./DataPopup";
import "../../css/Styles/Home.css";

const Home = () => {
  const { auth, flash, skins = [], wallet = { coins: 0 }, ownedSkins = [] } = usePage().props;
  const flashData = flash || {};

  useEffect(() => {

  }, [skins, wallet, ownedSkins]);

  const [ownedSkinsState, setOwnedSkinsState] = useState(ownedSkins);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const tileSize = 50;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerTotalTime, setPlayerTotalTime] = useState(0);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [localCoins, setLocalCoins] = useState(wallet.coins);
  const [isDataPopupOpen, setIsDataPopupOpen] = useState(false);

  const chessBoardRef = useRef(null);

  const handleRetireClick = () => {
    if (chessBoardRef.current) {
      chessBoardRef.current.retireGame();
    }
  };

   const equippedMappingWhite = {};
     ownedSkinsState.forEach((skin) => {
     if (skin.pivot && skin.pivot.equipped) {
       // Convert the piece type to lower case so it matches the key in ChessBoard.jsx
       equippedMappingWhite[skin.piece_type.toLowerCase()] = skin.image.toLowerCase();
     }
   });

  const handleModalClose = () => setIsModalOpen(false);
  const handleShopClose = () => setIsShopOpen(false);

  const handleSkinPurchase = (cost, purchasedSkin) => {
    setLocalCoins((prev) => prev - cost);
    setOwnedSkinsState((prev) => [...prev, purchasedSkin]);
  };

  const handleEquipSkin = (skin, equipped) => {
    setOwnedSkinsState((prev) =>
      prev.map((s) => {
        if (s.piece_type === skin.piece_type) {
          return { ...s, pivot: { ...s.pivot, equipped: s.id === skin.id ? equipped : false } };
        }
        return s;
      })
    );
  };

  const handleLogout = () => {
    Inertia.post("/logout");
  };

  return (
    <div className="app">
      <div className="navbar">
        {auth.user ? (
          <>
            <div className="navbar-left">
              <span>Welcome, {auth.user.username}</span>
            </div>
            <div className="navbar-right">
              <button style={{ marginRight: '20px' }} onClick={() => setIsShopOpen(true)}>Shop</button>
              <button style={{ marginRight: '20px' }} onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-right" style={{display:'flex'}}>
              <button onClick={() => setRegisterOpen(true)}>Register</button>
              <div className="divider" style={{marginLeft:'5px', marginRight:'5px'}}></div>
              <button onClick={() => setLoginOpen(true)}>Login</button>
            </div>
          </>
        )}
      </div>
      {flashData.message && <div>{flashData.message}</div>}
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />}
      {isRegisterOpen && <Register isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} />}
      <div className="content">
        {auth.user ? (
          <div className="main-content">
            <div className="chess-section">
              <div className="chess-container">
                <div className="column-labels">
                  {["A", "B", "C", "D", "E", "F", "G", "H"].map((label, index) => (
                    <div key={index} className="column-label">{label}</div>
                  ))}
                </div>
                <div className="row-labels">
                  {[8, 7, 6, 5, 4, 3, 2, 1].map((label, index) => (
                  <div key={index} className="row-label">{label}</div>
                 ))}
                </div>
                <ChessBoard
                  ref={chessBoardRef}
                  moveHistory={moveHistory}
                  setMoveHistory={setMoveHistory}
                  setPlayerTotalTime={setPlayerTotalTime}
                  equippedSkinsMapping={equippedMappingWhite}
                />
              </div>
            </div>
            <div className="sidebar" style={{ width: "300px" }}>
              <div className="sidebar-scrollable">
                <div className="move-list-section" style={{ width: "100%" }}>
                  <MoveList movePairs={moveHistory} />
                  <RecordGameModal isOpen={isModalOpen} onClose={handleModalClose} computedTime={playerTotalTime} />
                </div>
                <div className="custom-buttons-container">
                  <button className="custom-button" onClick={() => setIsDataPopupOpen(true)}>
                    Show Game History
                  </button>
                  <button className="custom-button" onClick={handleRetireClick}>
                    Retire
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-section">
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
          ownedSkins={ownedSkinsState}
          onPurchase={handleSkinPurchase}
          onEquip={handleEquipSkin}
        />
      )}
      <DataPopup isOpen={isDataPopupOpen} onClose={() => setIsDataPopupOpen(false)} />
    </div>
  );
};

export default Home;