// King.jsx
import Piece from './Piece';
import WhiteKing from '../../../Images/WhiteKing.png';
import BlackKing from '../../../Images/BlackKing.png';

class King extends Piece {
  static type = 'king';

  canMove(x, y, board) {
    const dx = Math.abs(this.matrixPosition.x - x);
    const dy = Math.abs(this.matrixPosition.y - y);
    return (dx <= 1 && dy <= 1) || (dx === 2 && dy === 0);
  }

  generateMoves(board) {
    const moves = [];
    const kingMoves = [
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
      { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
      { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
    ];
    kingMoves.forEach(({ dx, dy }) => {
      const x = this.matrixPosition.x + dx;
      const y = this.matrixPosition.y + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const target = board.getPieceAt(x, y);
        if (!target || target.white !== this.white) {
          moves.push({ x, y });
        }
      }
    });
    if (!this.hasMoved) {
      const y = this.matrixPosition.y;
      if (!board.getPieceAt(5, y) && !board.getPieceAt(6, y)) {
        const kingsideRook = board.getPieceAt(7, y);
        if (kingsideRook && kingsideRook.white === this.white && !kingsideRook.hasMoved) {
          moves.push({ x: 6, y, castling: 'kingside' });
        }
      }
      if (!board.getPieceAt(1, y) && !board.getPieceAt(2, y) && !board.getPieceAt(3, y)) {
        const queensideRook = board.getPieceAt(0, y);
        if (queensideRook && queensideRook.white === this.white && !queensideRook.hasMoved) {
          moves.push({ x: 2, y, castling: 'queenside' });
        }
      }
    }
    return moves;
  }

  render() {
    return (
      <img
        src={this.white ? WhiteKing : BlackKing}
        alt="King"
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}

export default King;