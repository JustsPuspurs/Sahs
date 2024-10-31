// js/Pages/Pieces/King.jsx
import Piece from './Piece';
import WhiteKing from '../../../Images/WhiteKing.png';
import BlackKing from '../../../Images/BlackKing.png';

class King extends Piece {
  canMove(x, y, board) {
    const dx = Math.abs(this.matrixPosition.x - x);
    const dy = Math.abs(this.matrixPosition.y - y);
    return dx <= 1 && dy <= 1;
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

    return moves;
  }

  render() {
    return <img src={this.white ? WhiteKing : BlackKing} alt="King" style={{ width: '100%', height: '100%' }} />;
  }
}

export default King;
