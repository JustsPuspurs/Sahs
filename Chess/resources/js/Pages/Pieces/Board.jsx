// js/Pages/Pieces/Board.jsx
class Board {
  constructor(pieces) {
    this.pieces = pieces;
  }

  // Finds the piece at a given x, y coordinate
  getPieceAt(x, y) {
    return this.pieces.find(
      (piece) => piece.matrixPosition.x === x && piece.matrixPosition.y === y
    );
  }

  // Moves a piece from one position to another, handling captures and castling.
  move(from, to) {
    const pieceToMove = this.getPieceAt(from.x, from.y);

    if (!pieceToMove) {
      console.error("No piece found at the source position:", from);
      return;
    }

    const targetPiece = this.getPieceAt(to.x, to.y);

    // Handle capturing of opposing pieces.
    if (targetPiece && targetPiece.white !== pieceToMove.white) {
      this.pieces = this.pieces.filter((p) => p !== targetPiece);
    }

    // If the move is a king move and the horizontal distance is 2, then perform castling.
    if (pieceToMove.constructor.name === 'King' && Math.abs(to.x - pieceToMove.matrixPosition.x) === 2) {
      // Determine whether kingside or queenside based on destination.
      if (to.x > pieceToMove.matrixPosition.x) {
        // Kingside castling.
        const rook = this.getPieceAt(7, from.y);
        if (rook && rook.constructor.name === 'Rook' && !rook.hasMoved) {
          // Ensure squares between king and rook are free.
          if (!this.getPieceAt(5, from.y) && !this.getPieceAt(6, from.y)) {
            pieceToMove.move(to.x, to.y);
            rook.move(5, from.y);
            return;
          }
        }
      } else {
        // Queenside castling.
        const rook = this.getPieceAt(0, from.y);
        if (rook && rook.constructor.name === 'Rook' && !rook.hasMoved) {
          if (!this.getPieceAt(1, from.y) && !this.getPieceAt(2, from.y) && !this.getPieceAt(3, from.y)) {
            pieceToMove.move(to.x, to.y);
            rook.move(3, from.y);
            return;
          }
        }
      }
    }

    // Regular move.
    pieceToMove.move(to.x, to.y);
  }

  // Clones the board and pieces to allow manipulation without affecting the original board.
  clone() {
    const clonedPieces = this.pieces.map((piece) => piece.clone());
    return new Board(clonedPieces);
  }
}

export default Board;