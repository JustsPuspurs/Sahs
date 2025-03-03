import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Login from './Login';
import Register from './Register';
import ChessBoard from './ChessBoard';
import MoveList from './GameHistory';
import '../../css/Styles/Home.css';

const Home = () => {
  const { auth, flash } = usePage().props;
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  // Lift moveHistory state to Home.
  const [moveHistory, setMoveHistory] = useState([]);
  const tileSize = 50; // used to set history container height

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
            <div className="divider"></div>
            <button onClick={() => setLoginOpen(true)}>Login</button>
          </>
        )}
      </div>
      {flash.message && <div>{flash.message}</div>}
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />}
      {isRegisterOpen && <Register isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} />}
      
      <div className="content">
        {auth.user ? (
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", justifyContent: "center" }}>
            {/* Container for chessboard with labels */}
            <div>
              <div className="chess-container">
                <div className="column-labels">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, index) => (
                    <div key={index} className="column-label">{label}</div>
                  ))}
                </div>
                <div className="row-labels">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((label, index) => (
                    <div key={index} className="row-label">{label}</div>
                  ))}
                </div>
                <ChessBoard moveHistory={moveHistory} setMoveHistory={setMoveHistory} />
              </div>
            </div>
            {/* Separate Game History Container */}
            <div style={{ 
              width: "200px", 
              height: 8 * tileSize, 
              overflowY: "auto", 
              backgroundColor: "rgba(46,46,46,0.8)", 
              padding: "10px", 
              border: "2px solid #444", 
              color: "#fff" 
            }}>
              <MoveList moves={moveHistory} />
            </div>
          </div>
        ) : (
          <div>
            <h1>Welcome to Chess Game</h1>
            <p>Please log in or register to start playing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;