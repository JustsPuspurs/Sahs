import React, { useState } from 'react';
import axios from 'axios';

const RecordGameModal = ({ isOpen, onClose }) => {
  // Manage form fields in local state
  const [moves, setMoves] = useState('');
  const [time, setTime] = useState('');
  const [side, setSide] = useState('White');
  const [result, setResult] = useState('Win');

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data to send
    const gameData = { moves, time, side, result };

    axios.post('/game/result', gameData)
      .then(response => {
        console.log(response.data.message);
        // Optionally show a success message or do more logic
        onClose(); // Close the modal
      })
      .catch(error => {
        console.error('Error saving game result:', error);
        // Optionally show an error message
      });
  };

  // If modal is not open, don't render anything
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
          {/* Time */}
          <div>
            <label htmlFor="time">Time:</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
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