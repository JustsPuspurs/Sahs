class Piece {
  constructor(x, y, isWhite) {
    this.matrixPosition = { x, y };
    this.white = isWhite;
    this.taken = false;
    this.hasMoved = false; // NEW: Track if the piece has moved.
  }

  move(x, y) {
    this.matrixPosition.x = x;
    this.matrixPosition.y = y;
    this.hasMoved = true; // Mark as moved.
  }

  clone() {
    const clonedPiece = new this.constructor(
      this.matrixPosition.x,
      this.matrixPosition.y,
      this.white
    );
    clonedPiece.taken = this.taken;
    clonedPiece.hasMoved = this.hasMoved;
    return clonedPiece;
  }

  canMove(x, y, board) {
    return false;
  }

  generateMoves(board) {
    return [];
  }
}

export default Piece;