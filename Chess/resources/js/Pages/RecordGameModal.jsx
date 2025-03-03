import React, { useState } from 'react';
import axios from 'axios';

const RecordGameModal = ({ isOpen, onClose, computedTime }) => {
  // Manage form fields in local state (time is now computed, so it's not stored here)
  const [moves, setMoves] = useState('');
  const [side, setSide] = useState('White');
  const [result, setResult] = useState('Win');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data to send using computedTime (in milliseconds)
    const gameData = { moves, time: computedTime, side, result };

    axios.post('/game/result', gameData)
      .then(response => {
        console.log(response.data.message);
        onClose(); // Close the modal
      })
      .catch(error => {
        console.error('Error saving game result:', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Close Button */}
        <div className="close-button-container">
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <h2>Record Game</h2>
        <form onSubmit={handleSubmit}>
          {/* Moves */}
          <div>
            <label htmlFor="moves">Moves:</label>
            <input
              id="moves"
              type="text"
              value={moves}
              onChange={(e) => setMoves(e.target.value)}
              placeholder="e.g. e4 e5 Nf3 Nc6 ..."
            />
          </div>
          {/* Display computed time */}
          <div>
            <label>Time:</label>
            <p>{computedTime} ms</p>
          </div>
          {/* Side */}
          <div>
            <label htmlFor="side">Side:</label>
            <select
              id="side"
              value={side}
              onChange={(e) => setSide(e.target.value)}
            >
              <option value="White">White</option>
              <option value="Black">Black</option>
            </select>
          </div>
          {/* Result */}
          <div>
            <label htmlFor="result">Result:</label>
            <select
              id="result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <option value="Win">Win</option>
              <option value="Lose">Lose</option>
              <option value="Draw">Draw</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>
            Save Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordGameModal;