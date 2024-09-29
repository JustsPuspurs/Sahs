import React, { useState } from "react";
import ChessBoard from './ChessBoard'; // Assuming you have the ChessBoard component ready
import '../../css/Styles/Home.css'; 

const App = () => {
  return (
    <div className="app">
      {/* Navigation bar with buttons */}
      <div className="navbar">
        <a href="/" className="nav-link">Poga 1</a> {/* First Button */}
        <a href="/" className="nav-link">Poga 2</a> {/* Second Button */}
        {/* Add more buttons or links here as needed */}
      </div>

      {/* Main Content (Chessboard with labels) */}
      <div className="content">
        <div className="grid-container">
          {/* Column Labels */}
          <div className="column-labels">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, index) => (
              <div key={index} className="label-column">{label}</div>
            ))}
          </div>

          {/* Grid and Row Labels with Chessboard */}
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

export default App;
