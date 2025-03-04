// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import Login from "./Login";
import Register from "./Register";
import ChessBoard from "./ChessBoard";
import MoveList from "./MoveList"; // Table displaying white and black moves
import RecordGameModal from "./RecordGameModal";
import Shop from "./Shop";
import DataPopup from "./DataPopup"; // Import the new popup component
import "../../css/Styles/Home.css";

const Home = () => {
  const { auth, flash, skins = [], wallet = { coins: 0 }, ownedSkins = [] } = usePage().props;
  const flashData = flash || {};

  useEffect(() => {
    console.log("Skins:", skins);
    console.log("Wallet:", wallet);
    console.log("Owned Skins:", ownedSkins);
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
  const [isDataPopupOpen, setIsDataPopupOpen] = useState(false); // For our data popup

  // Create a ref for the ChessBoard so we can call its retire method.
  const chessBoardRef = useRef(null);

  const handleRetireClick = () => {
    if (chessBoardRef.current) {
      chessBoardRef.current.retireGame();
    }
  };

  const equippedMappingWhite = {};
  ownedSkinsState.forEach((skin) => {
    if (skin.pivot && skin.pivot.equipped) {
      equippedMappingWhite[skin.piece_type] = skin.image;
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
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />}
      {isRegisterOpen && <Register isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} />}
      <div className="content">
        {auth.user ? (
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", justifyContent: "center" }}>
            <div>
              <div className="chess-container">
                <div className="column-labels">
                  {["A", "B", "C", "D", "E", "F", "G", "H"].map((label, index) => (
                    <div key={index} className="column-label">{label}</div>
                  ))}
                </div>
                <div className="row-labels">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((label, index) => (
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
              <button onClick={handleRetireClick}>Retire</button>
              {/* Button to show the data popup */}
              <button onClick={() => setIsDataPopupOpen(true)}>Show Game History</button>
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
              <MoveList movePairs={moveHistory} />
              <RecordGameModal isOpen={isModalOpen} onClose={handleModalClose} computedTime={playerTotalTime} />
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
          ownedSkins={ownedSkinsState}
          onPurchase={handleSkinPurchase}
          onEquip={handleEquipSkin}
        />
      )}
      {/* Render the DataPopup modal */}
      <DataPopup isOpen={isDataPopupOpen} onClose={() => setIsDataPopupOpen(false)} />
    </div>
  );
};

export default Home;