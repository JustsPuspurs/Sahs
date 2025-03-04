// DataPopup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const DataPopup = ({ isOpen, onClose }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to convert milliseconds to "X min Y sec" format.
  const formatTime = (timeMs) => {
    if (timeMs === null || timeMs === undefined) return "N/A";
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      axios.get("/game-history")
        .then((response) => {
          setGameHistory(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching game history.");
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate summary statistics
  const wins = gameHistory.filter(game => game.result.toLowerCase().includes("win")).length;
  const losses = gameHistory.filter(game => game.result.toLowerCase().includes("lose")).length;
  const draws = gameHistory.filter(game => game.result.toLowerCase().includes("draw")).length;

  return (
    <div className="modal">
      <div 
        className="modal-content" 
        style={{
          width: "80%",
          maxWidth: "80%",
          margin: "0 auto",
          padding: "20px"
        }}
      >
        <div className="close-button-container">
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <h2>Game History</h2>
        {/* Summary Stats */}
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Total Wins:</strong> {wins}</p>
          <p><strong>Total Losses:</strong> {losses}</p>
          <p><strong>Total Draws:</strong> {draws}</p>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div style={{ maxHeight: "auto", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Side</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Result</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Time</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Moves</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, index) => (
                  <tr key={index}>
                    <td style={{ padding: "4px 8px" }}>{game.side}</td>
                    <td style={{ padding: "4px 8px" }}>{game.result}</td>
                    <td style={{ padding: "4px 8px" }}>{formatTime(game.time)}</td>
                    <td style={{ padding: "4px 8px" }}>{game.moves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DataPopup;