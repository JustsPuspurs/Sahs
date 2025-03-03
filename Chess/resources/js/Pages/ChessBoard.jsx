import React, { useState, useRef } from "react";
import axios from "axios";
import Board from "./Pieces/Board";
import Pawn from "./Pieces/Pawn";
import Rook from "./Pieces/Rook";
import Knight from "./Pieces/Knight";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";
import { runMinimax, applyMove } from "./PC";

const tileSize = 50;

const initialSetup = () => {
  const pieces = [
    new Rook(0, 0, false), new Knight(1, 0, false), new Bishop(2, 0, false),
    new Queen(3, 0, false), new King(4, 0, false), new Bishop(5, 0, false),
    new Knight(6, 0, false), new Rook(7, 0, false),
    new Pawn(0, 1, false), new Pawn(1, 1, false), new Pawn(2, 1, false),
    new Pawn(3, 1, false), new Pawn(4, 1, false), new Pawn(5, 1, false),
    new Pawn(6, 1, false), new Pawn(7, 1, false),
    new Pawn(0, 6, true), new Pawn(1, 6, true), new Pawn(2, 6, true),
    new Pawn(3, 6, true), new Pawn(4, 6, true), new Pawn(5, 6, true),
    new Pawn(6, 6, true), new Pawn(7, 6, true),
    new Rook(0, 7, true), new Knight(1, 7, true), new Bishop(2, 7, true),
    new Queen(3, 7, true), new King(4, 7, true), new Bishop(5, 7, true),
    new Knight(6, 7, true), new Rook(7, 7, true),
  ];
  return new Board(pieces);
};

const promotePawn = (pawn, promotionChoice) => {
  const x = pawn.matrixPosition.x;
  const y = pawn.matrixPosition.y;
  switch (promotionChoice.toLowerCase()) {
    case "rook":
      return new Rook(x, y, pawn.white);
    case "bishop":
      return new Bishop(x, y, pawn.white);
    case "knight":
      return new Knight(x, y, pawn.white);
    default:
      return new Queen(x, y, pawn.white);
  }
};

const getLegalMovesForPiece = (piece, board, isKingInCheck) => {
  const candidateMoves = piece.generateMoves(board);
  return candidateMoves.filter(move => {
    const newBoard = board.clone();
    newBoard.move(piece.matrixPosition, { x: move.x, y: move.y });
    return !isKingInCheck(newBoard, piece.white);
  });
};

const isSquareHighlighted = (x, y, moves) =>
  moves.some(move => move.x === x && move.y === y);

const ChessBoard = ({ moveHistory, setMoveHistory }) => {
  const [board, setBoard] = useState(initialSetup());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [whitesMove, setWhitesMove] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [playerTotalTime, setPlayerTotalTime] = useState(0);
  const [gameSaved, setGameSaved] = useState(false);

  // useRef to track player's move times (excluding AI's thinking time)
  const playerStartTimeRef = useRef(null);
  const lastPlayerMoveTimeRef = useRef(null);

  const isKingInCheck = (brd, isWhitePlayer) => {
    const king = brd.pieces.find(
      (piece) => piece.constructor.name === "King" && piece.white === isWhitePlayer
    );
    if (!king) return false;
    let opponentMoves = [];
    brd.pieces.forEach(piece => {
      if (piece.white !== isWhitePlayer) {
        opponentMoves = opponentMoves.concat(piece.generateMoves(brd));
      }
    });
    return opponentMoves.some(
      (move) =>
        move.x === king.matrixPosition.x &&
        move.y === king.matrixPosition.y
    );
  };

  const checkGameOver = (brd, isWhitePlayer) => {
    let legalMoves = [];
    brd.pieces.forEach(piece => {
      if (piece.white === isWhitePlayer) {
        legalMoves = legalMoves.concat(getLegalMovesForPiece(piece, brd, isKingInCheck));
      }
    });
    if (legalMoves.length === 0) {
      if (isKingInCheck(brd, isWhitePlayer)) {
        return isWhitePlayer ? "Black wins by checkmate" : "White wins by checkmate";
      } else {
        return "Draw by stalemate";
      }
    }
    return null;
  };

  // Save game result automatically before restarting.
  const saveGameResult = () => {
    // Assuming the player is "White"
    let playerResult = "Win";
    if (gameResult.includes("Black wins")) {
      playerResult = "Lose";
    } else if (gameResult.includes("Draw")) {
      playerResult = "Draw";
    }
    axios.post('/game/result', { 
      moves: moveHistory.join(" | "),  // combine moves into a single string
      time: playerTotalTime,
      side: "White",
      result: playerResult
    })
    .then(response => {
      console.log("Game saved:", response.data.message);
      setGameSaved(true);
    })
    .catch(error => {
      console.error("Error saving game:", error);
    });
  };

  const handleRestart = () => {
    if (gameResult && !gameSaved) {
      saveGameResult();
    }
    // Reset the board and timing states
    setBoard(initialSetup());
    setSelectedPiece(null);
    setWhitesMove(true);
    setGameResult(null);
    setMoveHistory([]);
    playerStartTimeRef.current = null;
    lastPlayerMoveTimeRef.current = null;
    setPlayerTotalTime(0);
    setGameSaved(false);
  };

  const handleRetire = () => {
    setGameResult("Black wins by resignation");
  };

  const handleSquareClick = (col, row) => {
    if (gameResult) return;

    const legalMoves = selectedPiece ? getLegalMovesForPiece(selectedPiece, board, isKingInCheck) : [];

    if (selectedPiece && isSquareHighlighted(col, row, legalMoves)) {
      const now = Date.now();
      if (!playerStartTimeRef.current) {
        playerStartTimeRef.current = now;
        lastPlayerMoveTimeRef.current = now;
      } else {
        const delta = now - lastPlayerMoveTimeRef.current;
        setPlayerTotalTime(prev => prev + delta);
        lastPlayerMoveTimeRef.current = now;
      }

      const newBoard = board.clone();
      const moveDescription = `${selectedPiece.constructor.name} from ${selectedPiece.matrixPosition.x},${selectedPiece.matrixPosition.y} to ${col},${row}`;
      newBoard.move(selectedPiece.matrixPosition, { x: col, y: row });
      if (selectedPiece.constructor.name === "Pawn") {
        const movedPawn = newBoard.getPieceAt(col, row);
        if (
          (movedPawn.white && movedPawn.matrixPosition.y === 0) ||
          (!movedPawn.white && movedPawn.matrixPosition.y === 7)
        ) {
          let promotionChoice = window.prompt(
            "Promote pawn to which piece? (Queen, Rook, Bishop, Knight)",
            "Queen"
          );
          const promotedPiece = promotePawn(movedPawn, promotionChoice);
          newBoard.pieces = newBoard.pieces.map((p) =>
            p === movedPawn ? promotedPiece : p
          );
        }
      }
      setBoard(newBoard);
      setMoveHistory([...moveHistory, moveDescription]);
      setSelectedPiece(null);

      const resultAfterHuman = checkGameOver(newBoard, false);
      if (resultAfterHuman) {
        setGameResult(resultAfterHuman);
        return;
      }

      setWhitesMove(false);
      setTimeout(() => {
        const result = runMinimax(newBoard, 3, false);
        const bestMove = result.move;
        if (bestMove) {
          const updatedBoard = applyMove(newBoard, bestMove);
          const aiMoveDescription = `AI moves piece from ${bestMove.from.x},${bestMove.from.y} to ${bestMove.to.x},${bestMove.to.y}`;
          setBoard(updatedBoard);
          setMoveHistory(prev => [...prev, aiMoveDescription]);

          const resultAfterAI = checkGameOver(updatedBoard, true);
          if (resultAfterAI) {
            setGameResult(resultAfterAI);
          }
        } else {
          console.log("AI has no valid moves.");
        }
        setWhitesMove(true);
      }, 500);
      return;
    }

    const clickedPiece = board.getPieceAt(col, row);
    if (clickedPiece && clickedPiece.white === whitesMove) {
      setSelectedPiece(clickedPiece);
    } else {
      setSelectedPiece(null);
    }
  };

  const highlightMoves = selectedPiece ? getLegalMovesForPiece(selectedPiece, board, isKingInCheck) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleRetire}>Retire</button>
      </div>
      <div
        className="chessboard"
        style={{
          position: "relative",
          width: 8 * tileSize,
          height: 8 * tileSize,
        }}
      >
        {Array(8)
          .fill()
          .map((_, row) =>
            Array(8)
              .fill()
              .map((_, col) => (
                <div
                  key={`square-${row}-${col}`}
                  className={`square ${(row + col) % 2 === 0 ? "light" : "dark"}`}
                  style={{
                    position: "absolute",
                    top: row * tileSize,
                    left: col * tileSize,
                    width: tileSize,
                    height: tileSize,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => handleSquareClick(col, row)}
                >
                  {isSquareHighlighted(col, row, highlightMoves) && (
                    <div
                      style={{
                        position: "absolute",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "rgba(0,255,0,0.4)",
                        borderRadius: "50%",
                        zIndex: 1,
                      }}
                    />
                  )}
                  {board.pieces.map(
                    (piece, index) =>
                      piece &&
                      piece.matrixPosition.x === col &&
                      piece.matrixPosition.y === row && (
                        <span
                          key={index}
                          className="piece"
                          style={{
                            zIndex: 2,
                            border: selectedPiece === piece ? "2px solid yellow" : "none",
                            borderRadius: "50%",
                            ...(piece.constructor.name === "King" &&
                              isKingInCheck(board, piece.white) && { border: "2px solid red", borderRadius: "50%" }),
                          }}
                        >
                          {piece.render()}
                        </span>
                      )
                  )}
                </div>
              ))
          )}
      </div>
      {gameResult && (
        <div className="modal">
          <div className="modal-content">
            <h2>{gameResult}</h2>
            <div className="modal-buttons" style={{ marginTop: "20px" }}>
              <button onClick={handleRestart}>Restart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;