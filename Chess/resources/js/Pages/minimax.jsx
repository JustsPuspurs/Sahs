import { Pawn, Rook, Knight, Bishop, Queen, King } from './pieces'; // Import all piece classes

// Function to determine if the game is over (either checkmate or stalemate)
const isCheckmateOrStalemate = (board, isWhitePlayer) => {
  const allMoves = generateMovesForPlayer(board, isWhitePlayer);
  
  // If no valid moves, check if the king is in check (checkmate or stalemate)
  if (allMoves.length === 0) {
    return isKingInCheck(board, isWhitePlayer) ? 'checkmate' : 'stalemate';
  }

  return false; // Return false if the game isn't over
};

// Minimax function with alpha-beta pruning (used to optimize the search space)
export const runMinimax = (board, depth, isMaximizingPlayer, alpha = -Infinity, beta = Infinity) => {
  // Check if the game is over (checkmate or stalemate)
  const gameStatus = isCheckmateOrStalemate(board, isMaximizingPlayer);

  if (depth === 0 || gameStatus) {
    if (gameStatus === 'checkmate') {
      // Return extreme value for checkmate: negative for AI, positive for human
      return { evaluation: isMaximizingPlayer ? -Infinity : Infinity, move: null };
    } else if (gameStatus === 'stalemate') {
      // Return neutral value for stalemate
      return { evaluation: 0, move: null };
    }
    // Return the board evaluation if no game-ending condition is met
    return { evaluation: evaluateBoard(board), move: null };
  }

  // Log the current depth and player (maximizing or minimizing)
  console.log(`Evaluating at depth ${depth} for ${isMaximizingPlayer ? 'maximizing (black)' : 'minimizing (white)'} player`);

  let bestMove = null;

  // Maximize for AI (black)
  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    const moves = generateMovesForPlayer(board, false); // Generate black's moves

    for (let move of moves) {
      const newBoard = applyMove(board, move); // Apply the move and get the new board state
      // Recursively call minimax on the resulting board (switching to minimizing player)
      const evaluation = runMinimax(newBoard, depth - 1, !isMaximizingPlayer, alpha, beta).evaluation;

      // Track the best move (maximize evaluation)
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      // Update alpha (best option so far for maximizing player)
      alpha = Math.max(alpha, evaluation);
      // Beta cutoff (pruning)
      if (beta <= alpha) {
        break;
      }
    }
    return { evaluation: maxEval, move: bestMove };

  } else {
    // Minimize for human player (white)
    let minEval = Infinity;
    const moves = generateMovesForPlayer(board, true); // Generate white's moves

    for (let move of moves) {
      const newBoard = applyMove(board, move); // Apply the move and get the new board state
      // Recursively call minimax on the resulting board (switching to maximizing player)
      const evaluation = runMinimax(newBoard, depth - 1, true, alpha, beta).evaluation;

      // Track the best move (minimize evaluation)
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      // Update beta (best option so far for minimizing player)
      beta = Math.min(beta, evaluation);
      // Alpha cutoff (pruning)
      if (beta <= alpha) {
        break;
      }
    }
    return { evaluation: minEval, move: bestMove };
  }
};

// Generate valid moves for the given player
export const generateMovesForPlayer = (board, isWhitePlayer) => {
  const allMoves = [];

  board.pieces.forEach(piece => {
    if (piece.white !== isWhitePlayer) return; // Skip pieces that don't belong to the player

    const moves = piece.generateMoves(board); // Generate all valid moves for the piece
    console.log(`Moves for ${piece.constructor.name} (${piece.matrixPosition.x}, ${piece.matrixPosition.y}): `, moves);

    // Add each move to the list of all moves
    moves.forEach(move => {
      const targetPiece = board.getPieceAt(move.x, move.y);

      // Check if the move captures a piece (prioritize capturing moves)
      if (targetPiece && targetPiece.white !== piece.white) {
        // Capturing move gets higher priority
        allMoves.unshift({ from: piece.matrixPosition, to: move, capture: true, value: getPieceValue(targetPiece) });
      } else {
        // Non-capturing move
        allMoves.push({ from: piece.matrixPosition, to: move, capture: false });
      }
    });
  });

  // Sort moves: capturing high-value pieces first
  allMoves.sort((a, b) => (b.value || 0) - (a.value || 0));

  console.log("Total moves for player", isWhitePlayer ? "white" : "black", allMoves);
  return allMoves;
};

// Check if the king is in check
const isKingInCheck = (board, isWhitePlayer) => {
  const king = board.pieces.find(piece => piece instanceof King && piece.white === isWhitePlayer);
  if (!king) return false;

  // Check if the king's position is under attack
  const opponentMoves = generateMovesForPlayer(board, !isWhitePlayer);
  return opponentMoves.some(move => move.to.x === king.matrixPosition.x && move.to.y === king.matrixPosition.y);
};

// Apply the move to the board and check for validity
export const applyMove = (board, move) => {
  if (!move || !move.from || !move.to) {
    console.error("Invalid move:", move);
    return board.clone(); // Return the original board if the move is invalid
  }

  const newBoard = board.clone(); // Clone the board to avoid modifying the original
  const pieceToMove = newBoard.getPieceAt(move.from.x, move.from.y);

  if (!pieceToMove) {
    console.error("No piece to move at:", move.from);
    return newBoard; // Return the cloned board if no piece was found
  }

  // Apply the move
  newBoard.move(move.from, move.to);

  // Check if the move leaves the king in check (invalidate the move if true)
  if (isKingInCheck(newBoard, pieceToMove.white)) {
    console.error("Move leaves king in check:", move);
    return board; // Return the original board if the move is invalid
  }

  return newBoard; // Return the new board state after applying the move
};

// Board evaluation function (used by minimax to evaluate the current board state)
const evaluateBoard = board => {
  let score = 0;

  board.pieces.forEach(piece => {
    if (!piece.taken) {
      // Add value for each piece, positive for white, negative for black
      score += piece.white ? getPieceValue(piece) : -getPieceValue(piece);

      // Add additional value for pieces in strong positions (center control, etc.)
      score += piece.white ? getPositionalBonus(piece) : -getPositionalBonus(piece);
    }
  });

  return score; // Return the total evaluation score of the board
};

// Add a positional bonus for controlling the center of the board
const getPositionalBonus = piece => {
  const { x, y } = piece.matrixPosition;

  // Add extra points for pieces in the central squares (3,3), (3,4), (4,3), (4,4)
  const centerBonus = (x === 3 || x === 4) && (y === 3 || y === 4) ? 0.5 : 0;

  return centerBonus; // Return the positional bonus
};

// Assign values to each piece
const getPieceValue = piece => {
  if (piece instanceof Pawn) return 1; // Pawns are worth 1 point
  if (piece instanceof Knight || piece instanceof Bishop) return 3; // Knights and bishops are worth 3 points
  if (piece instanceof Rook) return 5; // Rooks are worth 5 points
  if (piece instanceof Queen) return 9; // Queens are worth 9 points
  if (piece instanceof King) return 1000; // The king is invaluable, hence a very high score
  return 0; // Return 0 for unknown piece types
};
