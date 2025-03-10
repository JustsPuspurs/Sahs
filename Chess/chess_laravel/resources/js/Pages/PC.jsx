import Board from "./Pieces/Board";
import Pawn from "./Pieces/Pawn";
import Rook from "./Pieces/Rook";
import Knight from "./Pieces/Knight";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";

const isCheckmateOrStalemate = (board, isWhitePlayer) => {
  const moves = generateMovesForPlayer(board, isWhitePlayer);
  let hasLegalMove = false;
  for (let move of moves) {
    const testBoard = applyMove(board, move);
    if (testBoard !== board) {
      hasLegalMove = true;
      break;
    }
  }
  if (!hasLegalMove) {
    return isKingInCheck(board, isWhitePlayer) ? "checkmate" : "stalemate";
  }
  return false;
};

export const runMinimax = (board, depth, isMaximizingPlayer, alpha = -Infinity, beta = Infinity) => {
  const gameStatus = isCheckmateOrStalemate(board, isMaximizingPlayer);
  if (depth === 0 || gameStatus) {
    if (gameStatus === "checkmate") {
      return {
        evaluation: isMaximizingPlayer ? -Infinity : Infinity,
        move: null,
      };
    } else if (gameStatus === "stalemate") {
      return { evaluation: 0, move: null };
    }
    return { evaluation: evaluateBoard(board), move: null };
  }

  let bestMove = null;
  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    const moves = generateMovesForPlayer(board, true);
    for (let move of moves) {
      const movingPiece = board.getPieceAt(move.from.x, move.from.y);
      if (
        movingPiece instanceof Pawn &&
        movingPiece.white &&
        move.to.y === 0
      ) {
        let bestPromoEval = -Infinity;
        let bestPromoType = null;
        for (let promo of ["queen", "rook", "bishop", "knight"]) {
          const newBoard = board.clone();
          const pawn = newBoard.getPieceAt(move.from.x, move.from.y);
          const target = newBoard.getPieceAt(move.to.x, move.to.y);
          if (target) {
            newBoard.pieces = newBoard.pieces.filter(p => p !== target);
          }
          newBoard.pieces = newBoard.pieces.filter(p => p !== pawn);
          let promotedPiece;
          switch (promo) {
            case "rook":
              promotedPiece = new Rook(move.to.x, move.to.y, pawn.white);
              break;
            case "bishop":
              promotedPiece = new Bishop(move.to.x, move.to.y, pawn.white);
              break;
            case "knight":
              promotedPiece = new Knight(move.to.x, move.to.y, pawn.white);
              break;
            default:
              promotedPiece = new Queen(move.to.x, move.to.y, pawn.white);
          }
          newBoard.pieces.push(promotedPiece);
          const result = runMinimax(newBoard, depth - 1, false, alpha, beta);
          if (result.evaluation > bestPromoEval) {
            bestPromoEval = result.evaluation;
            bestPromoType = promo;
          }
          alpha = Math.max(alpha, bestPromoEval);
          if (beta <= alpha) break;
        }
        if (bestPromoEval > maxEval) {
          maxEval = bestPromoEval;
          bestMove = { ...move, promotion: bestPromoType };
        }
        continue;
      }

      const newBoard = applyMove(board, move);
      if (newBoard === board) continue;
      const evaluation = runMinimax(newBoard, depth - 1, false, alpha, beta).evaluation;
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    if (bestMove === null && moves.length > 0) {
      bestMove = moves[0];
    }
    return { evaluation: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    const moves = generateMovesForPlayer(board, false);
    for (let move of moves) {
      const movingPiece = board.getPieceAt(move.from.x, move.from.y);
      if (
        movingPiece instanceof Pawn &&
        !movingPiece.white &&
        move.to.y === 7
      ) {
        let bestPromoEval = Infinity;
        let bestPromoType = null;
        for (let promo of ["queen", "rook", "bishop", "knight"]) {
          const newBoard = board.clone();
          const pawn = newBoard.getPieceAt(move.from.x, move.from.y);
          const target = newBoard.getPieceAt(move.to.x, move.to.y);
          if (target) {
            newBoard.pieces = newBoard.pieces.filter(p => p !== target);
          }
          newBoard.pieces = newBoard.pieces.filter(p => p !== pawn);
          let promotedPiece;
          switch (promo) {
            case "rook":
              promotedPiece = new Rook(move.to.x, move.to.y, pawn.white);
              break;
            case "bishop":
              promotedPiece = new Bishop(move.to.x, move.to.y, pawn.white);
              break;
            case "knight":
              promotedPiece = new Knight(move.to.x, move.to.y, pawn.white);
              break;
            default:
              promotedPiece = new Queen(move.to.x, move.to.y, pawn.white);
          }
          newBoard.pieces.push(promotedPiece);
          const result = runMinimax(newBoard, depth - 1, true, alpha, beta);
          if (result.evaluation < bestPromoEval) {
            bestPromoEval = result.evaluation;
            bestPromoType = promo;
          }
          beta = Math.min(beta, bestPromoEval);
          if (beta <= alpha) break;
        }
        if (bestPromoEval < minEval) {
          minEval = bestPromoEval;
          bestMove = { ...move, promotion: bestPromoType };
        }
        continue;
      }

      const newBoard = applyMove(board, move);
      if (newBoard === board) continue;
      const evaluation = runMinimax(newBoard, depth - 1, true, alpha, beta).evaluation;
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    if (bestMove === null && moves.length > 0) {
      bestMove = moves[0];
    }
    return { evaluation: minEval, move: bestMove };
  }
};

export const generateMovesForPlayer = (board, isWhitePlayer) => {
  const allMoves = [];
  board.pieces.forEach(piece => {
    if (piece.white !== isWhitePlayer) return;
    const moves = piece.generateMoves(board);
    moves.forEach(move => {
      const targetPiece = board.getPieceAt(move.x, move.y);
      if (targetPiece && targetPiece.white !== piece.white) {
        allMoves.unshift({
          from: piece.matrixPosition,
          to: move,
          capture: true,
          value: getPieceValue(targetPiece),
        });
      } else {
        allMoves.push({
          from: piece.matrixPosition,
          to: move,
          capture: false,
        });
      }
    });
  });
  allMoves.sort((a, b) => (b.value || 0) - (a.value || 0));
  return allMoves;
};

const isKingInCheck = (board, isWhitePlayer) => {
  const king = board.pieces.find(p => p instanceof King && p.white === isWhitePlayer);
  if (!king) return false;
  const opponentMoves = generateMovesForPlayer(board, !isWhitePlayer);
  return opponentMoves.some(
    move =>
      move.to.x === king.matrixPosition.x &&
      move.to.y === king.matrixPosition.y
  );
};

export const applyMove = (board, move) => {
  if (!move || !move.from || !move.to) {
    return board.clone();
  }
  const newBoard = board.clone();
  const pieceToMove = newBoard.getPieceAt(move.from.x, move.from.y);
  if (!pieceToMove) {
    return newBoard;
  }
  // Handle pawn promotion.
  if (
    pieceToMove instanceof Pawn &&
    ((pieceToMove.white && move.to.y === 0) ||
      (!pieceToMove.white && move.to.y === 7))
  ) {
    const promoChoice = move.promotion ? move.promotion.toLowerCase() : "queen";
    const targetPiece = newBoard.getPieceAt(move.to.x, move.to.y);
    if (targetPiece && targetPiece.white !== pieceToMove.white) {
      newBoard.pieces = newBoard.pieces.filter(p => p !== targetPiece);
    }
    newBoard.pieces = newBoard.pieces.filter(p => p !== pieceToMove);
    let promotedPiece;
    switch (promoChoice) {
      case "rook":
        promotedPiece = new Rook(move.to.x, move.to.y, pieceToMove.white);
        break;
      case "bishop":
        promotedPiece = new Bishop(move.to.x, move.to.y, pieceToMove.white);
        break;
      case "knight":
        promotedPiece = new Knight(move.to.x, move.to.y, pieceToMove.white);
        break;
      default:
        promotedPiece = new Queen(move.to.x, move.to.y, pieceToMove.white);
    }
    newBoard.pieces.push(promotedPiece);
    if (isKingInCheck(newBoard, pieceToMove.white)) {
      return board;
    }
    return newBoard;
  }

  // Move the piece (for king or others)
  newBoard.move(move.from, move.to);

  // Handle castling: if move has a castling flag and the moved piece is a king, move the rook.
  if (move.castling && pieceToMove.constructor.name === "King") {
    const y = move.to.y;
    if (move.castling === 'kingside') {
      // Kingside castling: move the rook from (7, y) to (5, y).
      const rookFrom = { x: 7, y };
      const rookTo = { x: 5, y };
      newBoard.move(rookFrom, rookTo);
    } else if (move.castling === 'queenside') {
      // Queenside castling: move the rook from (0, y) to (3, y).
      const rookFrom = { x: 0, y };
      const rookTo = { x: 3, y };
      newBoard.move(rookFrom, rookTo);
    }
  }

  if (isKingInCheck(newBoard, pieceToMove.white)) {
    return board;
  }
  return newBoard;
};

const evaluateBoard = (board) => {
  let score = 0;
  board.pieces.forEach(piece => {
    if (!piece.taken) {
      score += piece.white ? getPieceValue(piece) : -getPieceValue(piece);
      score += piece.white ? getPositionalBonus(piece) : -getPositionalBonus(piece);
    }
  });
  if (isKingInCheck(board, true)) score -= 0.5;
  if (isKingInCheck(board, false)) score += 0.5;
  const whiteNonKings = board.pieces.filter(p => p.white && !(p instanceof King));
  const blackNonKings = board.pieces.filter(p => !p.white && !(p instanceof King));
  const whiteKing = board.pieces.find(p => p instanceof King && p.white);
  const blackKing = board.pieces.find(p => p instanceof King && !p.white);
  if (whiteKing && blackKing) {
    if (whiteNonKings.length === 0 && blackNonKings.length > 0) {
      const dx = Math.abs(whiteKing.matrixPosition.x - blackKing.matrixPosition.x);
      const dy = Math.abs(whiteKing.matrixPosition.y - blackKing.matrixPosition.y);
      const kingDistance = Math.max(dx, dy);
      score -= (7 - kingDistance) * 0.5;
    }
    if (blackNonKings.length === 0 && whiteNonKings.length > 0) {
      const dx = Math.abs(whiteKing.matrixPosition.x - blackKing.matrixPosition.x);
      const dy = Math.abs(whiteKing.matrixPosition.y - blackKing.matrixPosition.y);
      const kingDistance = Math.max(dx, dy);
      score += (7 - kingDistance) * 0.5;
    }
  }
  return score;
};

const getPositionalBonus = (piece) => {
  const { x, y } = piece.matrixPosition;
  let bonus = 0;
  if ((x === 3 || x === 4) && (y === 3 || y === 4)) {
    bonus += 1.0;
  }
  if (piece instanceof Knight || piece instanceof Bishop) {
    bonus += piece.hasMoved ? 0.5 : -0.5;
  }
  if (piece instanceof Pawn && (x === 3 || x === 4)) {
    bonus += piece.hasMoved ? 0.3 : -0.3;
  }
  if (piece instanceof Rook) {
    bonus += piece.hasMoved ? 0.2 : -0.2;
  }
  if (piece instanceof Queen) {
    bonus += piece.hasMoved ? 0.1 : -0.1;
  }
  return bonus;
};

const getPieceValue = (piece) => {
  if (piece instanceof Pawn) return 1;
  if (piece instanceof Knight || piece instanceof Bishop) return 3;
  if (piece instanceof Rook) return 5;
  if (piece instanceof Queen) return 9;
  if (piece instanceof King) return 100;
  return 0;
};

export default runMinimax;