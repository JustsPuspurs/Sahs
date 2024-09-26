import { King } from './pieces';  // Import the King class

export const applyMove = (board, move) => {
  const newBoard = board.clone(); // Clone the board

  // Move the piece from the 'from' position to the 'to' position
  newBoard.move(move.from, move.to);
  return newBoard;
};

// Minimax implementation
export const runMinimax = (board, depth, isMaximizingPlayer) => {
  if (depth === 0 || isGameOver(board)) {
    return evaluateBoard(board);
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    const moves = generateMovesForPlayer(board, true); // True for AI (black)

    for (let move of moves) {
      const newBoard = applyMove(board, move);
      const evaluation = runMinimax(newBoard, depth - 1, false);
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const moves = generateMovesForPlayer(board, false); // False for human (white)

    for (let move of moves) {
      const newBoard = applyMove(board, move);
      const evaluation = runMinimax(newBoard, depth - 1, true);
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
};

// Helper function to generate valid moves for a player
export const generateMovesForPlayer = (board, isAIPlayer) => {
  const allMoves = [];
  board.pieces.forEach(piece => {
    if (piece.white !== isAIPlayer) return; // Skip opponent's pieces

    const moves = piece.generateMoves(board);
    moves.forEach(move => {
      allMoves.push({ from: piece.matrixPosition, to: move });
    });
  });
  return allMoves;
};

// Evaluation function to assess board strength (can be more complex)
const evaluateBoard = board => {
  let score = 0;
  board.pieces.forEach(piece => {
    if (!piece.taken) {
      score += piece.white ? piece.value : -piece.value;
    }
  });
  return score;
};

// Function to determine if the game is over
const isGameOver = board => {
  const whiteKing = board.pieces.find(piece => piece instanceof King && piece.white);
  const blackKing = board.pieces.find(piece => piece instanceof King && !piece.white);
  return !whiteKing || !blackKing;
};
