import React, { useState } from 'react';
import { King, Queen, Rook, Bishop, Knight, Pawn } from './pieces'; // Import pieces
import { runMinimax } from './minimax'; // Import Minimax AI logic

const tileSize = 80; // Size of each chessboard square

const ChessBoard = () => {
  const [board, setBoard] = useState(initialSetup()); // Setup the initial chessboard
  const [selectedPiece, setSelectedPiece] = useState(null); // Track the selected piece
  const [whitesMove, setWhitesMove] = useState(true); // True when it's white's turn
  const [isAIThinking, setIsAIThinking] = useState(false); // True when AI is thinking

  // Function to set up all pieces at their starting positions
  function initialSetup() {
    return [
      // Black Pieces (Top)
      new Rook(0, 0, false, 'r'), new Knight(1, 0, false, 'n'), new Bishop(2, 0, false, 'b'),
      new Queen(3, 0, false, 'q'), new King(4, 0, false, 'k'),
      new Bishop(5, 0, false, 'b'), new Knight(6, 0, false, 'n'), new Rook(7, 0, false, 'r'),
      new Pawn(0, 1, false, 'p'), new Pawn(1, 1, false, 'p'), new Pawn(2, 1, false, 'p'),
      new Pawn(3, 1, false, 'p'), new Pawn(4, 1, false, 'p'), new Pawn(5, 1, false, 'p'),
      new Pawn(6, 1, false, 'p'), new Pawn(7, 1, false, 'p'),

      // White Pieces (Bottom)
      new Rook(0, 7, true, 'R'), new Knight(1, 7, true, 'N'), new Bishop(2, 7, true, 'B'),
      new Queen(3, 7, true, 'Q'), new King(4, 7, true, 'K'),
      new Bishop(5, 7, true, 'B'), new Knight(6, 7, true, 'N'), new Rook(7, 7, true, 'R'),
      new Pawn(0, 6, true, 'P'), new Pawn(1, 6, true, 'P'), new Pawn(2, 6, true, 'P'),
      new Pawn(3, 6, true, 'P'), new Pawn(4, 6, true, 'P'), new Pawn(5, 6, true, 'P'),
      new Pawn(6, 6, true, 'P'), new Pawn(7, 6, true, 'P'),
    ];
  }

  // Handle when a square is clicked
  const handleSquareClick = (x, y) => {
    if (isAIThinking) return; // Don't allow interactions while AI is thinking

    if (selectedPiece) {
      console.log(`Trying to move ${selectedPiece.letter} to (${x}, ${y})`);
      // Try to move the selected piece
      if (selectedPiece.canMove(x, y, board)) {
        selectedPiece.move(x, y, board); // Move the piece
        setBoard([...board]); // Update the board state
        setSelectedPiece(null);
        setWhitesMove(false); // Switch turns (Black's turn)

        // AI (Black's turn)
        setIsAIThinking(true);
        setTimeout(() => {
          const newBoard = runMinimax(board); // AI's move
          setBoard(newBoard);
          setIsAIThinking(false);
          setWhitesMove(true); // Switch back to White's turn
        }, 1000); // Simulate AI thinking time
      } else {
        console.log('Invalid move');
        setSelectedPiece(null); // Invalid move, deselect piece
      }
    } else {
      // Select a piece if it's white's turn and the selected piece belongs to the player
      const piece = board.find(p => p.matrixPosition.x === x && p.matrixPosition.y === y);
      if (piece && piece.white === whitesMove) {
        console.log(`Selected ${piece.letter} at (${x}, ${y})`);
        setSelectedPiece(piece);
      }
    }
  };

  // Rendering the chessboard
  return (
    <div className="chessboard" style={{ position: 'relative', width: 8 * tileSize, height: 8 * tileSize }}>
      {Array(8).fill().map((_, row) => (
        Array(8).fill().map((_, col) => (
          <div key={`square-${row}-${col}`} className={`square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`}
               style={{
                 position: 'absolute',
                 top: row * tileSize,
                 left: col * tileSize,
                 width: tileSize,
                 height: tileSize,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '32px',
                 fontWeight: 'bold',
               }}
               onClick={() => handleSquareClick(col, row)}>
            {/* Render each piece on the chessboard */}
            {board.map((piece) => {
              if (piece.matrixPosition.x === col && piece.matrixPosition.y === row) {
                return (
                  <div key={`piece-${piece.matrixPosition.x}-${piece.matrixPosition.y}`}>
                    {piece.render()} {/* Render the piece using text */}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))
      ))}
    </div>
  );
};

export default ChessBoard;
