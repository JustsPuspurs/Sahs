// js/Pages/Pieces/Piece.jsx
class Piece {
  constructor(x, y, isWhite) {
    this.matrixPosition = { x, y };
    this.white = isWhite;
    this.taken = false;
  }

  move(x, y) {
    this.matrixPosition.x = x;
    this.matrixPosition.y = y;
  }

  clone() {
    const clonedPiece = new this.constructor(
      this.matrixPosition.x,
      this.matrixPosition.y,
      this.white
    );
    clonedPiece.taken = this.taken;
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
