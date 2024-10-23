import React, { useState } from "react";
import { Pawn, Rook, Knight, Bishop, Queen, King, Board } from './pieces';
import { runMinimax, applyMove } from './minimax';  // Ensure applyMove is imported
import '../../css/Styles/ChessBoard.css';

const tileSize = 50;

const initialSetup = () => {
  const pieces = [
    // Black pieces (top)
    new Rook(0, 0, false), new Knight(1, 0, false), new Bishop(2, 0, false), new Queen(3, 0, false), new King(4, 0, false), new Bishop(5, 0, false), new Knight(6, 0, false), new Rook(7, 0, false),
    new Pawn(0, 1, false), new Pawn(1, 1, false), new Pawn(2, 1, false), new Pawn(3, 1, false), new Pawn(4, 1, false), new Pawn(5, 1, false), new Pawn(6, 1, false), new Pawn(7, 1, false),

    // White pieces (bottom)
    new Pawn(0, 6, true), new Pawn(1, 6, true), new Pawn(2, 6, true), new Pawn(3, 6, true), new Pawn(4, 6, true), new Pawn(5, 6, true), new Pawn(6, 6, true), new Pawn(7, 6, true),
    new Rook(0, 7, true), new Knight(1, 7, true), new Bishop(2, 7, true), new Queen(3, 7, true), new King(4, 7, true), new Bishop(5, 7, true), new Knight(6, 7, true), new Rook(7, 7, true),
  ];

  return new Board(pieces);
};


const ChessBoard = () => {
  const [board, setBoard] = useState(initialSetup());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [whitesMove, setWhitesMove] = useState(true);

  const handleSquareClick = (x, y) => {
    const clickedPiece = board.getPieceAt(x, y);
  
    if (selectedPiece) {
      if (selectedPiece.canMove(x, y, board)) {
        const newBoard = board.clone();
        newBoard.move(selectedPiece.matrixPosition, { x, y });
        setBoard(newBoard);
        setSelectedPiece(null);
  
        // Switch to AI's move after white plays
        setWhitesMove(false);
        setTimeout(() => {
          const result = runMinimax(newBoard, 3, true); // Run minimax for black
          const bestMove = result.move;
          if (bestMove) {
            const updatedBoard = applyMove(newBoard, bestMove); // Apply the best move
            setBoard(updatedBoard);
          } else {
            console.log("AI has no valid moves.");
          }
          setWhitesMove(true); // Switch back to white's turn
        },);
      } else {
        setSelectedPiece(null); // Invalid move, deselect the piece
      }
    } else {
      if (clickedPiece && clickedPiece.white === whitesMove) {
        setSelectedPiece(clickedPiece); // Select the piece
      }
    }
  };

  return (
    <div className="chessboard" style={{ position: 'relative', width: 8 * tileSize, height: 8 * tileSize }}>
      {Array(8)
        .fill()
        .map((_, row) =>
          Array(8)
            .fill()
            .map((_, col) => (
              <div
                key={`square-${row}-${col}`}
                className={`square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`}
                style={{
                  position: 'absolute',
                  top: row * tileSize,
                  left: col * tileSize,
                  width: tileSize,
                  height: tileSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => handleSquareClick(col, row)}
              >
                {board.pieces.map((piece, index) => {
                  if (piece && piece.matrixPosition.x === col && piece.matrixPosition.y === row) {
                    return (
                      <span key={index} className="piece">
                        {piece.render()}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            ))
        )}
    </div>
  );
};

export default ChessBoard;
