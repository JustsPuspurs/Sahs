// Minimax implementation
const maxDepth = 3;

// Min function (for human player, white's turn)
function minFun(board, depth) {
  if (depth >= maxDepth) {
    board.setScore(); // Evaluate the board
    return board.score;
  }

  const boards = generateNewBoardsWhitesTurn(board); // Generate white's moves
  let lowestScore = Infinity;

  for (let i = 0; i < boards.length; i++) {
    if (!boards[i].isDead()) {
      const score = maxFun(boards[i], depth + 1); // Call maxFun for black
      if (score < lowestScore) {
        lowestScore = score;
      }
    }
  }

  return lowestScore;
}

// Max function (for AI, black's turn)
function maxFun(board, depth) {
  if (depth >= maxDepth) {
    board.setScore(); // Evaluate the board
    return board.score;
  }

  const boards = generateNewBoardsBlacksTurn(board); // Generate black's moves
  let topScore = -Infinity;

  for (let i = 0; i < boards.length; i++) {
    const score = minFun(boards[i], depth + 1); // Call minFun for white
    if (score > topScore) {
      topScore = score;
    }
  }

  return topScore;
}

// Run Minimax to determine AI's best move
export function runMinimax(board) {
  const boards = generateNewBoardsBlacksTurn(board); // Generate all possible AI moves
  let bestMove = null;
  let bestScore = -Infinity;

  for (let i = 0; i < boards.length; i++) {
    const score = minFun(boards[i], 1); // Start from depth 1 (AI's move)
    if (score > bestScore) {
      bestScore = score;
      bestMove = boards[i]; // Choose the best move
    }
  }

  return bestMove; // Return the best move for AI
}

// Helper function to generate possible white moves
function generateNewBoardsWhitesTurn(board) {
  const boards = [];
  board.forEach((piece) => {
    if (piece.white && !piece.taken) {
      const moves = piece.generateMoves(board); // Generate all valid moves
      moves.forEach((move) => {
        const newBoard = cloneBoard(board); // Clone the current board
        const movingPiece = newBoard.find((p) => p.matrixPosition.x === piece.matrixPosition.x && p.matrixPosition.y === piece.matrixPosition.y);
        movingPiece.move(move.x, move.y, newBoard); // Move piece on cloned board
        boards.push(newBoard); // Add the new board state to the list
      });
    }
  });
  return boards;
}

// Helper function to generate possible black moves
function generateNewBoardsBlacksTurn(board) {
  const boards = [];
  board.forEach((piece) => {
    if (!piece.white && !piece.taken) {
      const moves = piece.generateMoves(board); // Generate all valid moves
      moves.forEach((move) => {
        const newBoard = cloneBoard(board); // Clone the current board
        const movingPiece = newBoard.find((p) => p.matrixPosition.x === piece.matrixPosition.x && p.matrixPosition.y === piece.matrixPosition.y);
        movingPiece.move(move.x, move.y, newBoard); // Move piece on cloned board
        boards.push(newBoard); // Add the new board state to the list
      });
    }
  });
  return boards;
}

// Helper function to clone the board (for Minimax)
function cloneBoard(board) {
  return board.map((piece) => piece.clone()); // Clone all pieces on the board
}
