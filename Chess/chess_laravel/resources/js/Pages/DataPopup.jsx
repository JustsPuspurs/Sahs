import React, { useState, useEffect } from "react";
import axios from "axios";

const DataPopup = ({ isOpen, onClose }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // adjust as needed

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
      axios
        .get("/game-history")
        .then((response) => {
          setGameHistory(response.data);
          setLoading(false);
          setCurrentPage(1);
        })
        .catch((err) => {
          setError("Error fetching game history.");
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate summary statistics
  const wins = gameHistory.filter((game) =>
    game.result.toLowerCase().includes("win")
  ).length;
  const losses = gameHistory.filter((game) =>
    game.result.toLowerCase().includes("lose")
  ).length;
  const draws = gameHistory.filter((game) =>
    game.result.toLowerCase().includes("draw")
  ).length;

  // Pagination logic
  const totalPages = Math.ceil(gameHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = gameHistory.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="modal">
      <div className="modal-content data-popup-content">
        <div className="close-button-container">
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        <h2>Game History</h2>
        {/* Summary Stats */}
        <div className="summary-stats">
          <p>
            <strong>Total Wins:</strong> {wins}
          </p>
          <p>
            <strong>Total Losses:</strong> {losses}
          </p>
          <p>
            <strong>Total Draws:</strong> {draws}
          </p>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="scrollable-table">
            <table className="move-table">
              <thead>
                <tr>
                  <th className="move-table-header">Side</th>
                  <th className="move-table-header">Result</th>
                  <th className="move-table-header">Time</th>
                  <th className="move-table-header">Moves</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((game, index) => (
                  <tr key={index}>
                    <td className="move-table-cell">{game.side}</td>
                    <td className="move-table-cell">{game.result}</td>
                    <td className="move-table-cell">{formatTime(game.time)}</td>
                    {/* Notice the new "moves-cell" class here */}
                    <td className="move-table-cell moves-cell">
                      {game.moves}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={goToPrevPage} disabled={currentPage === 1}>
                Prev
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPopup;