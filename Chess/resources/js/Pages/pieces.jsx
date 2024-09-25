class Piece {
  constructor(x, y, isWhite, letter) {
    this.matrixPosition = { x, y }; // Position of the piece on the board
    this.white = isWhite; // Whether the piece is white or black
    this.letter = letter; // The letter representing the piece ('K' for King, 'Q' for Queen, etc.)
    this.taken = false; // Whether the piece has been captured
  }

  render() {
    return <span>{this.letter}</span>; // Render the piece's letter
  }

  move(x, y, board) {
    console.log(`Moving ${this.letter} from (${this.matrixPosition.x}, ${this.matrixPosition.y}) to (${x}, ${y})`);
    this.matrixPosition = { x, y }; // Update the piece's position
  }

  // This will be overridden by specific pieces
  canMove(x, y, board) {
    return false;
  }

  // Generate all possible moves for a piece
  generateMoves(board) {
    const moves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }
}

class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, isWhite ? 'P' : 'p');
    this.firstMove = true;
  }

  canMove(x, y, board) {
    const forwardDirection = this.white ? -1 : 1;
    const startRow = this.white ? 6 : 1;

    // Check for one-square move
    if (x === this.matrixPosition.x && y === this.matrixPosition.y + forwardDirection) {
      return !board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y); // Square must be empty
    }

    // Check for two-square move (first move)
    if (this.firstMove && x === this.matrixPosition.x && y === this.matrixPosition.y + 2 * forwardDirection) {
      const oneSquareAhead = board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === this.matrixPosition.y + forwardDirection);
      const twoSquaresAhead = board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y);
      return !oneSquareAhead && !twoSquaresAhead;
    }

    // Check for diagonal capture
    if (Math.abs(x - this.matrixPosition.x) === 1 && y === this.matrixPosition.y + forwardDirection) {
      return board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y && p.white !== this.white);
    }

    return false;
  }

  move(x, y, board) {
    super.move(x, y, board);
    this.firstMove = false;
  }
}

class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, isWhite ? 'R' : 'r');
  }

  canMove(x, y, board) {
    if (x === this.matrixPosition.x || y === this.matrixPosition.y) {
      const stepX = x - this.matrixPosition.x > 0 ? 1 : x - this.matrixPosition.x < 0 ? -1 : 0;
      const stepY = y - this.matrixPosition.y > 0 ? 1 : y - this.matrixPosition.y < 0 ? -1 : 0;

      let tempX = this.matrixPosition.x + stepX;
      let tempY = this.matrixPosition.y + stepY;

      while (tempX !== x || tempY !== y) {
        if (board.some(p => p.matrixPosition.x === tempX && p.matrixPosition.y === tempY)) {
          return false; // Blocked by another piece
        }
        tempX += stepX;
        tempY += stepY;
      }
      return !board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y && p.white === this.white);
    }
    return false;
  }
}

class Bishop extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, isWhite ? 'B' : 'b');
  }

  canMove(x, y, board) {
    const dx = Math.abs(x - this.matrixPosition.x);
    const dy = Math.abs(y - this.matrixPosition.y);
    if (dx === dy) {
      const stepX = x - this.matrixPosition.x > 0 ? 1 : -1;
      const stepY = y - this.matrixPosition.y > 0 ? 1 : -1;

      let tempX = this.matrixPosition.x + stepX;
      let tempY = this.matrixPosition.y + stepY;

      while (tempX !== x || tempY !== y) {
        if (board.some(p => p.matrixPosition.x === tempX && p.matrixPosition.y === tempY)) {
          return false; // Blocked by another piece
        }
        tempX += stepX;
        tempY += stepY;
      }
      return !board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y && p.white === this.white);
    }
    return false;
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, isWhite ? 'N' : 'n');
  }

  canMove(x, y, board) {
    const dx = Math.abs(x - this.matrixPosition.x);
    const dy = Math.abs(y - this.matrixPosition.y);
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
      return !board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y && p.white === this.white);
    }
    return false;
  }
}

class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, isWhite ? 'K' : 'k');
  }

  canMove(x, y, board) {
    const dx = Math.abs(x - this.matrixPosition.x);
    const dy = Math.abs(y - this.matrixPosition.y);
    if (dx <= 1 && dy <= 1) {
      return !board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y && p.white === this.white);
    }
    return false;
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, isWhite ? 'Q' : 'q');
  }

  canMove(x, y, board) {
    const dx = Math.abs(x - this.matrixPosition.x);
    const dy = Math.abs(y - this.matrixPosition.y);
    if (dx === dy || x === this.matrixPosition.x || y === this.matrixPosition.y) {
      const stepX = x === this.matrixPosition.x ? 0 : x > this.matrixPosition.x ? 1 : -1;
      const stepY = y === this.matrixPosition.y ? 0 : y > this.matrixPosition.y ? 1 : -1;

      let tempX = this.matrixPosition.x + stepX;
      let tempY = this.matrixPosition.y + stepY;

      while (tempX !== x || tempY !== y) {
        if (board.some(p => p.matrixPosition.x === tempX && p.matrixPosition.y === tempY)) {
          return false; // Blocked by another piece
        }
        tempX += stepX;
        tempY += stepY;
      }
      return !board.some(p => p.matrixPosition.x === x && p.matrixPosition.y === y && p.white === this.white);
    }
    return false;
  }
}

// Export all pieces
export { King, Queen, Rook, Bishop, Knight, Pawn };
