import Board from './Pieces/Board';
import Pawn from './Pieces/Pawn';
import Rook from './Pieces/Rook';
import Knight from './Pieces/Knight';
import Bishop from './Pieces/Bishop';
import Queen from './Pieces/Queen';
import King from './Pieces/King';

// Function to check if the game is over (either checkmate or stalemate)
const isCheckmateOrStalemate = (board, isWhitePlayer) => {
  const allMoves = generateMovesForPlayer(board, isWhitePlayer);
  
  if (allMoves.length === 0) {
    return isKingInCheck(board, isWhitePlayer) ? 'checkmate' : 'stalemate';
  }
  return false;
};

// Minimax function with alpha-beta pruning
export const runMinimax = (board, depth, isMaximizingPlayer, alpha = -Infinity, beta = Infinity) => {
  const gameStatus = isCheckmateOrStalemate(board, isMaximizingPlayer);

  if (depth === 0 || gameStatus) {
    if (gameStatus === 'checkmate') {
      return { evaluation: isMaximizingPlayer ? -Infinity : Infinity, move: null };
    } else if (gameStatus === 'stalemate') {
      return { evaluation: 0, move: null };
    }
    return { evaluation: evaluateBoard(board), move: null };
  }

  console.log(`Evaluating at depth ${depth} for ${isMaximizingPlayer ? 'maximizing (black)' : 'minimizing (white)'} player`);

  let bestMove = null;

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    const moves = generateMovesForPlayer(board, false); // Black's moves

    for (let move of moves) {
      const newBoard = applyMove(board, move);
      const evaluation = runMinimax(newBoard, depth - 1, false, alpha, beta).evaluation;

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return { evaluation: maxEval, move: bestMove };

  } else {
    let minEval = Infinity;
    const moves = generateMovesForPlayer(board, true); // White's moves

    for (let move of moves) {
      const newBoard = applyMove(board, move);
      const evaluation = runMinimax(newBoard, depth - 1, true, alpha, beta).evaluation;

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return { evaluation: minEval, move: bestMove };
  }
};

// Generate valid moves for the player
export const generateMovesForPlayer = (board, isWhitePlayer) => {
  const allMoves = [];

  board.pieces.forEach(piece => {
    if (piece.white !== isWhitePlayer) return;

    const moves = piece.generateMoves(board);
    console.log(`Moves for ${piece.constructor.name} (${piece.matrixPosition.x}, ${piece.matrixPosition.y}): `, moves);

    moves.forEach(move => {
      const targetPiece = board.getPieceAt(move.x, move.y);

      if (targetPiece && targetPiece.white !== piece.white) {
        allMoves.unshift({ from: piece.matrixPosition, to: move, capture: true, value: getPieceValue(targetPiece) });
      } else {
        allMoves.push({ from: piece.matrixPosition, to: move, capture: false });
      }
    });
  });

  allMoves.sort((a, b) => (b.value || 0) - (a.value || 0));
  console.log("Total moves for player", isWhitePlayer ? "white" : "black", allMoves);
  return allMoves;
};

// Check if the king is in check
const isKingInCheck = (board, isWhitePlayer) => {
  const king = board.pieces.find(piece => piece instanceof King && piece.white === isWhitePlayer);
  if (!king) return false;

  const opponentMoves = generateMovesForPlayer(board, !isWhitePlayer);
  return opponentMoves.some(move => move.to.x === king.matrixPosition.x && move.to.y === king.matrixPosition.y);
};

// Apply a move to the board
export const applyMove = (board, move) => {
  if (!move || !move.from || !move.to) {
    console.error("Invalid move:", move);
    return board.clone();
  }

  const newBoard = board.clone();
  const pieceToMove = newBoard.getPieceAt(move.from.x, move.from.y);

  if (!pieceToMove) {
    console.error("No piece to move at:", move.from);
    return newBoard;
  }

  newBoard.move(move.from, move.to);

  if (isKingInCheck(newBoard, pieceToMove.white)) {
    console.error("Move leaves king in check:", move);
    return board;
  }

  return newBoard;
};

// Board evaluation function for minimax
const evaluateBoard = board => {
  let score = 0;

  board.pieces.forEach(piece => {
    if (!piece.taken) {
      score += piece.white ? getPieceValue(piece) : -getPieceValue(piece);
      score += piece.white ? getPositionalBonus(piece) : -getPositionalBonus(piece);
    }
  });

  return score;
};

// Add a positional bonus for center control
const getPositionalBonus = piece => {
  const { x, y } = piece.matrixPosition;
  const centerBonus = (x === 3 || x === 4) && (y === 3 || y === 4) ? 0.5 : 0;
  return centerBonus;
};

// Assign values to each piece
const getPieceValue = piece => {
  if (piece instanceof Pawn) return 1;
  if (piece instanceof Knight || piece instanceof Bishop) return 3;
  if (piece instanceof Rook) return 5;
  if (piece instanceof Queen) return 9;
  if (piece instanceof King) return 1000;
  return 0;
};
