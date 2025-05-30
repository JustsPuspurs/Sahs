// Rook.jsx
import Piece from './Piece';
import WhiteRook from '../../../Images/WhiteRook.png';
import BlackRook from '../../../Images/BlackRook.png';

class Rook extends Piece {
  static type = 'rook';

  canMove(x, y, board) {
    if (x !== this.matrixPosition.x && y !== this.matrixPosition.y) return false;
    const directionX = x > this.matrixPosition.x ? 1 : x < this.matrixPosition.x ? -1 : 0;
    const directionY = y > this.matrixPosition.y ? 1 : y < this.matrixPosition.y ? -1 : 0;
    let checkX = this.matrixPosition.x + directionX;
    let checkY = this.matrixPosition.y + directionY;
    while (checkX !== x || checkY !== y) {
      if (board.getPieceAt(checkX, checkY)) return false;
      checkX += directionX;
      checkY += directionY;
    }
    const target = board.getPieceAt(x, y);
    return !target || target.white !== this.white;
  }

  generateMoves(board) {
    const moves = [];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];
    directions.forEach(({ dx, dy }) => {
      let x = this.matrixPosition.x + dx;
      let y = this.matrixPosition.y + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8 && !board.getPieceAt(x, y)) {
        moves.push({ x, y });
        x += dx;
        y += dy;
      }
      const target = board.getPieceAt(x, y);
      if (target && target.white !== this.white) {
        moves.push({ x, y });
      }
    });
    return moves;
  }

  render() {
    return (
      <img
        src={this.white ? WhiteRook : BlackRook}
        alt="Rook"
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}

export default Rook;