import React, { useState } from 'react';
import axios from 'axios';

const RecordGameModal = ({ isOpen, onClose, computedTime }) => {
  const [moves, setMoves] = useState('');
  const [side, setSide] = useState('White');
  const [result, setResult] = useState('Win');

  const handleSubmit = (e) => {
    e.preventDefault();
    const gameData = { moves, time: computedTime, side, result };

    axios.post('/game/result', gameData)
      .then(response => {
        console.log(response.data.message);
        onClose();
      })
      .catch(error => {
        console.error('Error saving game result:', error);
      });
  };

  // Function to render the moves table with 7 columns per row
  const renderMovesTable = () => {
    const movesArray = moves.split(" ").filter(move => move.trim() !== "");
    const columns = 7; // Number of columns per row
    const rows = [];
    for (let i = 0; i < movesArray.length; i += columns) {
      rows.push(movesArray.slice(i, i + columns));
    }
    return (
      <table className="moves-preview-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((move, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {rowIndex * columns + colIndex + 1}. {move}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="close-button-container">
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <h2>Record Game</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="moves">Moves:</label>
            <input
              id="moves"
              type="text"
              value={moves}
              onChange={(e) => setMoves(e.target.value)}
              placeholder="e.g. e4 e5 Nf3 Nc6 ..."
            />
            {moves.trim() !== "" && renderMovesTable()}
          </div>
          <div>
            <label>Time:</label>
            <p>{computedTime} ms</p>
          </div>
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
          <button type="submit" className="record-game-button">
            Save Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordGameModal;