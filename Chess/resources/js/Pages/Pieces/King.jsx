// js/Pages/Pieces/King.jsx
import Piece from './Piece';
import Rook from './Rook';
import WhiteKing from '../../../Images/WhiteKing.png';
import BlackKing from '../../../Images/BlackKing.png';

class King extends Piece {
  canMove(x, y, board) {
    const dx = Math.abs(this.matrixPosition.x - x);
    const dy = Math.abs(this.matrixPosition.y - y);
    // Allow normal king moves (including castling moves which are two squares horizontally)
    return dx <= 1 && dy <= 1 || (dx === 2 && dy === 0);
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

    // CASTLING: only if the king hasn't moved.
    if (!this.hasMoved) {
      const y = this.matrixPosition.y;
      // Kingside castling: check squares between king and rook.
      if (!board.getPieceAt(5, y) && !board.getPieceAt(6, y)) {
        const kingsideRook = board.getPieceAt(7, y);
        if (kingsideRook && kingsideRook.white === this.white && !kingsideRook.hasMoved) {
          moves.push({ x: 6, y, castling: 'kingside' });
        }
      }
      // Queenside castling: check squares between king and rook.
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