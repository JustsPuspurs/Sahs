import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import Board from "./Pieces/Board";
import Pawn from "./Pieces/Pawn";
import Rook from "./Pieces/Rook";
import Knight from "./Pieces/Knight";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";
import { runMinimax, applyMove } from "./PC";
import axios from "axios";

// Blue images for pieces (used in the board when blue skin is equipped)
import BluePawn from '../../Images/BluePawn.png';
import BlueRook from '../../Images/BlueRook.png';
import BlueKnight from '../../Images/BlueKnight.png';
import BlueBishop from '../../Images/BlueBishop.png';
import BlueQueen from '../../Images/BlueQueen.png';
import BlueKing from '../../Images/BlueKing.png';

// Default white images (used as fallback in promotion modal until blue ones are equipped)
import WhiteQueen from '../../Images/WhiteQueen.png';
import WhiteRook from '../../Images/WhiteRook.png';
import WhiteKnight from '../../Images/WhiteKnight.png';
import WhiteBishop from '../../Images/WhiteBishop.png';

const imageMapping = {
  'images/blue_pawn.png': BluePawn,
  'images/blue_rook.png': BlueRook,
  'images/blue_knight.png': BlueKnight,
  'images/blue_bishop.png': BlueBishop,
  'images/blue_queen.png': BlueQueen,
  'images/blue_king.png': BlueKing,
};

const defaultPromotionImages = {
  Queen: WhiteQueen,
  Rook: WhiteRook,
  Bishop: WhiteBishop,
  Knight: WhiteKnight,
};

const tileSize = 50;

const initialSetup = () => {
  const pieces = [
    // Black pieces (top rows)
    new Rook(0, 0, false), new Knight(1, 0, false), new Bishop(2, 0, false),
    new Queen(3, 0, false), new King(4, 0, false), new Bishop(5, 0, false),
    new Knight(6, 0, false), new Rook(7, 0, false),
    new Pawn(0, 1, false), new Pawn(1, 1, false), new Pawn(2, 1, false),
    new Pawn(3, 1, false), new Pawn(4, 1, false), new Pawn(5, 1, false),
    new Pawn(6, 1, false), new Pawn(7, 1, false),
    // White pieces (bottom rows)
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
  const { x, y } = pawn.matrixPosition;
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

// Get legal moves by filtering candidate moves that would leave the king in check.
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

const convertCoordinates = (col, row) => {
  const file = String.fromCharCode("a".charCodeAt(0) + col);
  const rank = 8 - row;
  return file + rank;
};

const getAlgebraicMove = (piece, destCol, destRow) => {
  const pieceAbbreviations = {
    Pawn: "",
    Knight: "n",
    Bishop: "b",
    Rook: "r",
    Queen: "q",
    King: "k"
  };
  const prefix = pieceAbbreviations[piece.constructor.name] || "";
  return prefix + convertCoordinates(destCol, destRow);
};

const ChessBoard = ({ moveHistory, setMoveHistory, equippedSkinsMapping = {} }, ref) => {
  const [board, setBoard] = useState(initialSetup());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [whitesMove, setWhitesMove] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [playerTotalTime, setPlayerTotalTime] = useState(0);
  const [gameSaved, setGameSaved] = useState(false);
  const [promotionInfo, setPromotionInfo] = useState(null);

  const playerStartTimeRef = useRef(null);
  const lastPlayerMoveTimeRef = useRef(null);

  // isKingInCheck returns true if the king of the given color is under attack.
  const isKingInCheck = (brd, isWhitePlayer) => {
    const king = brd.pieces.find(
      piece => piece.constructor.name === "King" && piece.white === isWhitePlayer
    );
    if (!king) return false;
    let opponentMoves = [];
    brd.pieces.forEach(piece => {
      if (piece.white !== isWhitePlayer) {
        opponentMoves = opponentMoves.concat(piece.generateMoves(brd));
      }
    });
    return opponentMoves.some(
      move =>
        move.x === king.matrixPosition.x &&
        move.y === king.matrixPosition.y
    );
  };

  // Check game over condition.
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

  const handleRetire = () => {
    setGameResult("Black wins by resignation");
  };

  useImperativeHandle(ref, () => ({
    retireGame: handleRetire,
  }));

  const saveGameResult = () => {
    let playerResult = "Win";
    if (gameResult.includes("Black wins")) {
      playerResult = "Lose";
    } else if (gameResult.includes("Draw")) {
      playerResult = "Draw";
    }
    axios
      .post("/game/result", {
        moves: moveHistory.map(pair => `${pair.white} ${pair.black}`).join(" | "),
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

  // Handle promotion choice when a pawn reaches the back rank.
  const handlePromotionChoice = (promotionChoice) => {
    if (promotionInfo) {
      const { board: pendingBoard, pawn } = promotionInfo;
      const promotedPiece = promotePawn(pawn, promotionChoice);
      pendingBoard.pieces = pendingBoard.pieces.map(p => (p === pawn ? promotedPiece : p));
      setBoard(pendingBoard);
      setPromotionInfo(null);
      setSelectedPiece(null);

      const resultAfterHuman = checkGameOver(pendingBoard, false);
      if (resultAfterHuman) {
        setGameResult(resultAfterHuman);
        return;
      }
      setWhitesMove(false);
      setTimeout(() => {
        const result = runMinimax(pendingBoard, 3, false);
        const bestMove = result.move;
        if (bestMove) {
          const movingPiece = pendingBoard.getPieceAt(bestMove.from.x, bestMove.from.y);
          const blackMoveNotation = getAlgebraicMove(movingPiece, bestMove.to.x, bestMove.to.y);
          const newBoardAfterAI = applyMove(pendingBoard, bestMove);
          setBoard(newBoardAfterAI);
          setMoveHistory(prev => {
            const lastIndex = prev.length - 1;
            const newPair = { ...prev[lastIndex], black: blackMoveNotation };
            return [...prev.slice(0, lastIndex), newPair];
          });
          const resultAfterAI = checkGameOver(newBoardAfterAI, true);
          if (resultAfterAI) {
            setGameResult(resultAfterAI);
          }
        } else {
          console.log("AI has no valid moves.");
        }
        setWhitesMove(true);
      }, 500);
    }
  };

  const handleSquareClick = (col, row) => {
    if (gameResult || promotionInfo) return;

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
      const whiteMoveNotation = getAlgebraicMove(selectedPiece, col, row);
      setMoveHistory(prev => [...prev, { white: whiteMoveNotation, black: "" }]);

      // Look up the move from legalMoves to check for castling.
      const selectedMove = legalMoves.find(move => move.x === col && move.y === row);
      if (selectedPiece.constructor.name === "King" && selectedMove && selectedMove.castling) {
        // Castling move detected. Move the king...
        newBoard.move(selectedPiece.matrixPosition, { x: col, y: row });
        // ... and move the corresponding rook.
        const y = row;
        if (selectedMove.castling === "kingside") {
          const rook = newBoard.getPieceAt(7, y);
          if (rook) {
            newBoard.move({ x: 7, y }, { x: 5, y });
          }
        } else if (selectedMove.castling === "queenside") {
          const rook = newBoard.getPieceAt(0, y);
          if (rook) {
            newBoard.move({ x: 0, y }, { x: 3, y });
          }
        }
      } else {
        // Regular move.
        newBoard.move(selectedPiece.matrixPosition, { x: col, y: row });
      }

      // Handle pawn promotion.
      if (selectedPiece.constructor.name === "Pawn") {
        const movedPawn = newBoard.getPieceAt(col, row);
        if (
          (movedPawn.white && movedPawn.matrixPosition.y === 0) ||
          (!movedPawn.white && movedPawn.matrixPosition.y === 7)
        ) {
          setPromotionInfo({ board: newBoard, pawn: movedPawn });
          return;
        }
      }

      setBoard(newBoard);
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
          const movingPiece = newBoard.getPieceAt(bestMove.from.x, bestMove.from.y);
          const blackMoveNotation = getAlgebraicMove(movingPiece, bestMove.to.x, bestMove.to.y);
          const updatedBoard = applyMove(newBoard, bestMove);
          setBoard(updatedBoard);
          setMoveHistory(prev => {
            const lastIndex = prev.length - 1;
            const newPair = { ...prev[lastIndex], black: blackMoveNotation };
            return [...prev.slice(0, lastIndex), newPair];
          });
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
      <div className="chessboard">
        {Array(8)
          .fill()
          .map((_, row) =>
            Array(8)
              .fill()
              .map((_, col) => (
                <div
                  key={`square-${row}-${col}`}
                  className={`square ${(row + col) % 2 === 0 ? "light" : "dark"}`}
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
                              isKingInCheck(board, piece.white) && {
                                border: "2px solid red",
                                borderRadius: "50%"
                              }),
                          }}
                        >
                          {piece.white && equippedSkinsMapping[piece.constructor.name] ? (
                            <img
                              src={imageMapping[equippedSkinsMapping[piece.constructor.name]]}
                              alt={piece.constructor.name}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            piece.render()
                          )}
                        </span>
                      )
                  )}
                </div>
              ))
          )}
      </div>
      {promotionInfo && (
        <div
          className="promotion-modal"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(46, 46, 46, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            className="promotion-container"
            style={{
              backgroundColor: "rgba(46, 46, 46, 0.9)",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              gap: "10px",
            }}
          >
            {["Queen", "Rook", "Bishop", "Knight"].map(pieceType => {
              const imgSrc =
                equippedSkinsMapping && equippedSkinsMapping[pieceType]
                  ? imageMapping[equippedSkinsMapping[pieceType]]
                  : defaultPromotionImages[pieceType];
              return (
                <img
                  key={pieceType}
                  src={imgSrc}
                  alt={pieceType}
                  style={{
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    border: "2px solid transparent",
                  }}
                  onClick={() => handlePromotionChoice(pieceType)}
                />
              );
            })}
          </div>
        </div>
      )}
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

export default forwardRef(ChessBoard);
