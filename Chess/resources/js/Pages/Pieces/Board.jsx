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

  // Moves a piece from one position to another
  move(from, to) {
    const pieceToMove = this.getPieceAt(from.x, from.y);

    if (!pieceToMove) {
      console.error("No piece found at the source position:", from);
      return;
    }

    const targetPiece = this.getPieceAt(to.x, to.y);

    // Handle capturing of opposing pieces
    if (targetPiece && targetPiece.white !== pieceToMove.white) {
      this.pieces = this.pieces.filter((p) => p !== targetPiece);
    }

    pieceToMove.move(to.x, to.y); // Updates the piece's position
  }

  // Clones the board and pieces to allow manipulation without affecting the original board
  clone() {
    const clonedPieces = this.pieces.map((piece) => piece.clone());
    return new Board(clonedPieces);
  }
}

export default Board;