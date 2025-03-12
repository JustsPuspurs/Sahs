// Queen.jsx
import Piece from './Piece';
import Rook from './Rook';
import Bishop from './Bishop';
import WhiteQueen from '../../../Images/WhiteQueen.png';
import BlackQueen from '../../../Images/BlackQueen.png';

class Queen extends Piece {
  static type = 'queen';

  canMove(x, y, board) {
    const rookMoves = new Rook(this.matrixPosition.x, this.matrixPosition.y, this.white).canMove(x, y, board);
    const bishopMoves = new Bishop(this.matrixPosition.x, this.matrixPosition.y, this.white).canMove(x, y, board);
    return rookMoves || bishopMoves;
  }

  generateMoves(board) {
    const rookMoves = new Rook(this.matrixPosition.x, this.matrixPosition.y, this.white).generateMoves(board);
    const bishopMoves = new Bishop(this.matrixPosition.x, this.matrixPosition.y, this.white).generateMoves(board);
    return [...rookMoves, ...bishopMoves];
  }

  render() {
    return (
      <img
        src={this.white ? WhiteQueen : BlackQueen}
        alt="Queen"
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}

export default Queen;