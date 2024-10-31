// js/Pages/Pieces/Pawn.jsx
import Piece from './Piece';
import WhitePawn from '../../../Images/WhitePawn.png';
import BlackPawn from '../../../Images/BlackPawn.png';

class Pawn extends Piece {
  canMove(x, y, board) {
    const direction = this.white ? -1 : 1;
    const startRow = this.white ? 6 : 1;

    if (x === this.matrixPosition.x && y === this.matrixPosition.y + direction && !board.getPieceAt(x, y)) {
      return true;
    }
    if (x === this.matrixPosition.x && y === this.matrixPosition.y + 2 * direction && this.matrixPosition.y === startRow && !board.getPieceAt(x, y)) {
      return true;
    }
    if (Math.abs(x - this.matrixPosition.x) === 1 && y === this.matrixPosition.y + direction) {
      const target = board.getPieceAt(x, y);
      return target && target.white !== this.white;
    }
    return false;
  }

  generateMoves(board) {
    const moves = [];
    const direction = this.white ? -1 : 1;

    if (!board.getPieceAt(this.matrixPosition.x, this.matrixPosition.y + direction)) {
      moves.push({ x: this.matrixPosition.x, y: this.matrixPosition.y + direction });
    }

    const startRow = this.white ? 6 : 1;
    if (this.matrixPosition.y === startRow && !board.getPieceAt(this.matrixPosition.x, this.matrixPosition.y + 2 * direction)) {
      moves.push({ x: this.matrixPosition.x, y: this.matrixPosition.y + 2 * direction });
    }

    for (let dx of [-1, 1]) {
      const target = board.getPieceAt(this.matrixPosition.x + dx, this.matrixPosition.y + direction);
      if (target && target.white !== this.white) {
        moves.push({ x: this.matrixPosition.x + dx, y: this.matrixPosition.y + direction });
      }
    }

    return moves;
  }

  render() {
    return <img src={this.white ? WhitePawn : BlackPawn} alt="Pawn" style={{ width: '100%', height: '100%' }} />;
  }
}

export default Pawn;
