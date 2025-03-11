import Piece from './Piece';

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

    // // Castling: if the piece is the King moving 2 squares horizontally.
    // if (
    //   pieceToMove.constructor.name === 'King' &&
    //   Math.abs(to.x - pieceToMove.matrixPosition.x) === 2
    // ) {
    //   const y = from.y;
    //   if (to.x > pieceToMove.matrixPosition.x) {
    //     // Kingside castling: expect the rook at (7, y)
    //     const rook = this.getPieceAt(7, y);
    //     if (rook && rook.constructor.name === 'Rook' && !rook.hasMoved) {
    //       if (
    //         !this.getPieceAt(5, y) &&
    //         !this.getPieceAt(6, y)
    //       ) {
    //         // Swap positions: king and rook switch places.
    //         const kingOrigin = { ...pieceToMove.matrixPosition };
    //         pieceToMove.move(rook.matrixPosition.x, rook.matrixPosition.y);
    //         rook.move(kingOrigin.x, kingOrigin.y);
    //         return;
    //       }
    //     }
    //   } else {
    //     // Queenside castling: expect the rook at (0, y)
    //     const rook = this.getPieceAt(0, y);
    //     if (rook && rook.constructor.name === 'Rook' && !rook.hasMoved) {
    //       if (
    //         !this.getPieceAt(1, y) &&
    //         !this.getPieceAt(2, y) &&
    //         !this.getPieceAt(3, y)
    //       ) {
    //         const kingOrigin = { ...pieceToMove.matrixPosition };
    //         pieceToMove.move(rook.matrixPosition.x, rook.matrixPosition.y);
    //         rook.move(kingOrigin.x, kingOrigin.y);
    //         return;
    //       }
    //     }
    //   }
    //}

    // Regular move.
    pieceToMove.move(to.x, to.y);
  }

  // Clones the board and pieces.
  clone() {
    const clonedPieces = this.pieces.map((piece) => piece.clone());
    return new Board(clonedPieces);
  }
}

export default Board;