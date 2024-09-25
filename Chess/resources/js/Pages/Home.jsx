import React, { useState } from 'react';
import ChessBoard from './ChessBoard'; // Assuming ChessBoard.jsx is in the same directory
import '../../css/Styles/Home.css'; // Make sure the path is correct

const Home = () => {
  const [view, setView] = useState('login'); // State to manage views (login, register, chessboard)

  return (
    <div className="app">
      <div className="navbar">
        <button className="nav-link" onClick={() => setView('chessboard')}>ChessBoard</button>
      </div>

      <div className="content">
        {view === 'login' && <Login />}
        {view === 'register' && <Register />}
        {view === 'chessboard' && <ChessBoard />}
      </div>
    </div>
  );
};

export default Home;
