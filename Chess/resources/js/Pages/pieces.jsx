import React from 'react';

// Base Piece class
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

  generateMoves(board) {
    return []; // Override this in specific pieces
  }
}

// Board class
class Board {
  constructor(pieces) {
    this.pieces = pieces;
  }

  getPieceAt(x, y) {
    return this.pieces.find(piece => piece.matrixPosition.x === x && piece.matrixPosition.y === y);
  }

  move(from, to) {
    const pieceToMove = this.getPieceAt(from.x, from.y);
    if (pieceToMove) {
      const targetPiece = this.getPieceAt(to.x, to.y);
      if (targetPiece && targetPiece.white !== pieceToMove.white) {
        this.pieces = this.pieces.filter(p => p !== targetPiece); // Capture
      }
      pieceToMove.move(to.x, to.y);
    }
  }

  clone() {
    const clonedPieces = this.pieces.map(piece =>
      Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
    );
    return new Board(clonedPieces);
  }
}

// Pawn class
class Pawn extends Piece {
  generateMoves(board) {
    const moves = [];
    const direction = this.white ? -1 : 1;

    // Move one step forward
    if (!board.getPieceAt(this.matrixPosition.x, this.matrixPosition.y + direction)) {
      moves.push({ x: this.matrixPosition.x, y: this.matrixPosition.y + direction });
    }

    // Move two steps forward if at starting position
    const startRow = this.white ? 6 : 1;
    if (this.matrixPosition.y === startRow && !board.getPieceAt(this.matrixPosition.x, this.matrixPosition.y + 2 * direction)) {
      moves.push({ x: this.matrixPosition.x, y: this.matrixPosition.y + 2 * direction });
    }

    // Capture diagonally
    for (let dx of [-1, 1]) {
      const target = board.getPieceAt(this.matrixPosition.x + dx, this.matrixPosition.y + direction);
      if (target && target.white !== this.white) {
        moves.push({ x: this.matrixPosition.x + dx, y: this.matrixPosition.y + direction });
      }
    }

    return moves;
  }

  render() {
    return this.white ? '♙' : '♟';
  }
}

// Rook class
class Rook extends Piece {
  generateMoves(board) {
    const moves = [];
    const directions = [
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];

    for (let { dx, dy } of directions) {
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
    }

    return moves;
  }

  render() {
    return this.white ? '♖' : '♜';
  }
}

// Knight class
class Knight extends Piece {
  generateMoves(board) {
    const moves = [];
    const knightMoves = [
      { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
      { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
      { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
      { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
    ];

    for (let { dx, dy } of knightMoves) {
      const x = this.matrixPosition.x + dx;
      const y = this.matrixPosition.y + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const target = board.getPieceAt(x, y);
        if (!target || target.white !== this.white) {
          moves.push({ x, y });
        }
      }
    }

    return moves;
  }

  render() {
    return this.white ? '♘' : '♞';
  }
}

// Bishop class
class Bishop extends Piece {
  generateMoves(board) {
    const moves = [];
    const directions = [
      { dx: 1, dy: 1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: -1 }
    ];

    for (let { dx, dy } of directions) {
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
    }

    return moves;
  }

  render() {
    return this.white ? '♗' : '♝';
  }
}

// Queen class
class Queen extends Piece {
  generateMoves(board) {
    const rookMoves = new Rook(this.matrixPosition.x, this.matrixPosition.y, this.white).generateMoves(board);
    const bishopMoves = new Bishop(this.matrixPosition.x, this.matrixPosition.y, this.white).generateMoves(board);
    return [...rookMoves, ...bishopMoves];
  }

  render() {
    return this.white ? '♕' : '♛';
  }
}

// King class
class King extends Piece {
  generateMoves(board) {
    const moves = [];
    const directions = [
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
      { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
      { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
    ];

    for (let { dx, dy } of directions) {
      const x = this.matrixPosition.x + dx;
      const y = this.matrixPosition.y + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const target = board.getPieceAt(x, y);
        if (!target || target.white !== this.white) {
          moves.push({ x, y });
        }
      }
    }

    return moves;
  }

  render() {
    return this.white ? '♔' : '♚';
  }
}

export { Piece, Pawn, Rook, Knight, Bishop, Queen, King, Board };
