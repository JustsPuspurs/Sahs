// js/Pages/Pieces/Knight.jsx
import Piece from './Piece';
import WhiteKnight from '../../../Images/WhiteKnight.png';
import BlackKnight from '../../../Images/BlackKnight.png';

class Knight extends Piece {
  canMove(x, y, board) {
    const dx = Math.abs(this.matrixPosition.x - x);
    const dy = Math.abs(this.matrixPosition.y - y);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }

  generateMoves(board) {
    const moves = [];
    const knightMoves = [
      { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
      { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
      { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
      { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
    ];

    knightMoves.forEach(({ dx, dy }) => {
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
    return <img src={this.white ? WhiteKnight : BlackKnight} alt="Knight" style={{ width: '100%', height: '100%' }} />;
  }
}

export default Knight;
