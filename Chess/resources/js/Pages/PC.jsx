import Board from "./Pieces/Board";
import Pawn from "./Pieces/Pawn";
import Rook from "./Pieces/Rook";
import Knight from "./Pieces/Knight";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";

// Function to check if the game is over (either checkmate or stalemate)
const isCheckmateOrStalemate = (board, isWhitePlayer) => {
    const allMoves = generateMovesForPlayer(board, isWhitePlayer);
    if (allMoves.length === 0) {
        return isKingInCheck(board, isWhitePlayer) ? "checkmate" : "stalemate";
    }
    return false;
};

// Minimax function with alpha-beta pruning, now handling pawn promotion moves
export const runMinimax = (
    board,
    depth,
    isMaximizingPlayer,
    alpha = -Infinity,
    beta = Infinity
) => {
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
        const moves = generateMovesForPlayer(board, true); // White's moves
        for (let move of moves) {
            const movingPiece = board.getPieceAt(move.from.x, move.from.y);
            // Check if this move is a pawn reaching the promotion rank
            if (
                movingPiece instanceof Pawn &&
                ((movingPiece.white && move.to.y === 0) ||
                    (!movingPiece.white && move.to.y === 7))
            ) {
                let bestPromoEval = -Infinity;
                let bestPromoType = null;
                // Evaluate all promotion possibilities for this pawn move
                for (let promo of ["queen", "rook", "bishop", "knight"]) {
                    const newBoard = board.clone();
                    const pawn = newBoard.getPieceAt(move.from.x, move.from.y);
                    const target = newBoard.getPieceAt(move.to.x, move.to.y);
                    if (target) {
                        // Remove captured piece
                        newBoard.pieces = newBoard.pieces.filter(
                            (p) => p !== target
                        );
                    }
                    // Remove the pawn and add the promoted piece
                    newBoard.pieces = newBoard.pieces.filter((p) => p !== pawn);
                    let promotedPiece;
                    switch (promo) {
                        case "rook":
                            promotedPiece = new Rook(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                            break;
                        case "bishop":
                            promotedPiece = new Bishop(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                            break;
                        case "knight":
                            promotedPiece = new Knight(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                            break;
                        default:
                            promotedPiece = new Queen(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                    }
                    newBoard.pieces.push(promotedPiece);
                    // Recursively evaluate the board after promotion
                    const result = runMinimax(
                        newBoard,
                        depth - 1,
                        false,
                        alpha,
                        beta
                    );
                    const promoEval = result.evaluation; // Renamed variable to avoid reserved word "eval"
                    if (promoEval > bestPromoEval) {
                        bestPromoEval = promoEval;
                        bestPromoType = promo;
                    }
                    alpha = Math.max(alpha, bestPromoEval);
                    if (beta <= alpha) break; // alpha-beta cut-off
                }
                if (bestPromoEval > maxEval) {
                    maxEval = bestPromoEval;
                    bestMove = { ...move, promotion: bestPromoType }; // attach chosen promotion
                }
                continue; // move on to the next move candidate
            }

            // Normal move handling for non-promotion moves
            const newBoard = applyMove(board, move);
            if (newBoard === board) continue; // skip illegal moves (e.g., leaving king in check)
            const evaluation = runMinimax(
                newBoard,
                depth - 1,
                false,
                alpha,
                beta
            ).evaluation;
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
        const moves = generateMovesForPlayer(board, false); // Black's moves
        for (let move of moves) {
            const movingPiece = board.getPieceAt(move.from.x, move.from.y);
            // Check for pawn promotion moves for minimizing player
            if (
                movingPiece instanceof Pawn &&
                ((movingPiece.white && move.to.y === 0) ||
                    (!movingPiece.white && move.to.y === 7))
            ) {
                let bestPromoEval = Infinity;
                let bestPromoType = null;
                for (let promo of ["queen", "rook", "bishop", "knight"]) {
                    const newBoard = board.clone();
                    const pawn = newBoard.getPieceAt(move.from.x, move.from.y);
                    const target = newBoard.getPieceAt(move.to.x, move.to.y);
                    if (target) {
                        newBoard.pieces = newBoard.pieces.filter(
                            (p) => p !== target
                        );
                    }
                    newBoard.pieces = newBoard.pieces.filter((p) => p !== pawn);
                    let promotedPiece;
                    switch (promo) {
                        case "rook":
                            promotedPiece = new Rook(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                            break;
                        case "bishop":
                            promotedPiece = new Bishop(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                            break;
                        case "knight":
                            promotedPiece = new Knight(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                            break;
                        default:
                            promotedPiece = new Queen(
                                move.to.x,
                                move.to.y,
                                pawn.white
                            );
                    }
                    newBoard.pieces.push(promotedPiece);
                    const result = runMinimax(
                        newBoard,
                        depth - 1,
                        true,
                        alpha,
                        beta
                    );
                    const promoEval = result.evaluation; // Renamed variable here as well
                    if (promoEval < bestPromoEval) {
                        bestPromoEval = promoEval;
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

            // Normal move handling
            const newBoard = applyMove(board, move);
            if (newBoard === board) continue;
            const evaluation = runMinimax(
                newBoard,
                depth - 1,
                true,
                alpha,
                beta
            ).evaluation;
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
    board.pieces.forEach((piece) => {
        if (piece.white !== isWhitePlayer) return;
        const moves = piece.generateMoves(board);
        moves.forEach((move) => {
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

// Check if the king is in check
const isKingInCheck = (board, isWhitePlayer) => {
    const king = board.pieces.find(
        (piece) => piece instanceof King && piece.white === isWhitePlayer
    );
    if (!king) return false;
    const opponentMoves = generateMovesForPlayer(board, !isWhitePlayer);
    return opponentMoves.some(
        (move) =>
            move.to.x === king.matrixPosition.x &&
            move.to.y === king.matrixPosition.y
    );
};

// Modified applyMove function with promotion logic integrated
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

    // Pawn Promotion handling:
    if (
        pieceToMove instanceof Pawn &&
        ((pieceToMove.white && move.to.y === 0) ||
            (!pieceToMove.white && move.to.y === 7))
    ) {
        // Use move.promotion if provided; otherwise, default to queen.
        const promoChoice = move.promotion
            ? move.promotion.toLowerCase()
            : "queen";
        // Remove any opponent piece on the target square (capture)
        const targetPiece = newBoard.getPieceAt(move.to.x, move.to.y);
        if (targetPiece && targetPiece.white !== pieceToMove.white) {
            newBoard.pieces = newBoard.pieces.filter((p) => p !== targetPiece);
        }
        // Remove the pawn from the board
        newBoard.pieces = newBoard.pieces.filter((p) => p !== pieceToMove);
        let promotedPiece;
        switch (promoChoice) {
            case "rook":
                promotedPiece = new Rook(
                    move.to.x,
                    move.to.y,
                    pieceToMove.white
                );
                break;
            case "bishop":
                promotedPiece = new Bishop(
                    move.to.x,
                    move.to.y,
                    pieceToMove.white
                );
                break;
            case "knight":
                promotedPiece = new Knight(
                    move.to.x,
                    move.to.y,
                    pieceToMove.white
                );
                break;
            default:
                promotedPiece = new Queen(
                    move.to.x,
                    move.to.y,
                    pieceToMove.white
                );
        }
        newBoard.pieces.push(promotedPiece);
        // Verify that this move doesn't leave the king in check.
        if (isKingInCheck(newBoard, pieceToMove.white)) {
            console.error(
                "Move leaves king in check (illegal promotion):",
                move
            );
            return board;
        }
        return newBoard;
    }

    // Normal move handling (non-promotion)
    newBoard.move(move.from, move.to);
    if (isKingInCheck(newBoard, pieceToMove.white)) {
        console.error("Move leaves king in check:", move);
        return board;
    }
    return newBoard;
};

// Board evaluation function for minimax
const evaluateBoard = (board) => {
    let score = 0;
    board.pieces.forEach((piece) => {
        if (!piece.taken) {
            // Material value
            score += piece.white ? getPieceValue(piece) : -getPieceValue(piece);
            // Positional & development value
            score += piece.white
                ? getPositionalBonus(piece)
                : -getPositionalBonus(piece);
        }
    });
    return score;
};

// Add a positional bonus for center control
// Increase positional bonus for center and add development bonuses
const getPositionalBonus = (piece) => {
    const { x, y } = piece.matrixPosition;
    let bonus = 0;
    // **Center control**: reward pieces on central squares (d4, d5, e4, e5)
    if ((x === 3 || x === 4) && (y === 3 || y === 4)) {
        bonus += 1.0; // increased center bonus (was 0.5)
    }
    // **Minor piece development**: reward knights and bishops that have moved, penalize if still undeveloped
    if (piece instanceof Knight || piece instanceof Bishop) {
        if (piece.hasMoved) {
            bonus += 0.5; // knight/bishop developed – add bonus
        } else {
            bonus -= 0.5; // still on initial square – slight penalty
        }
    }
    // **Pawn development**: encourage moving central pawns (d- and e-file)
    if (piece instanceof Pawn && (x === 3 || x === 4)) {
        if (piece.hasMoved) {
            bonus += 0.3; // pawn has moved from its start (opened lines to bishops/queen)
        } else {
            bonus -= 0.3; // pawn still at home blocking pieces
        }
    }
    return bonus;
};

// Assign values to each piece
const getPieceValue = (piece) => {
    if (piece instanceof Pawn) return 1;
    if (piece instanceof Knight || piece instanceof Bishop) return 3;
    if (piece instanceof Rook) return 5;
    if (piece instanceof Queen) return 9;
    if (piece instanceof King) return 100;
    return 0;
};
