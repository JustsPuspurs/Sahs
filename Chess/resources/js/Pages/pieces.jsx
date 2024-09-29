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

  // Implement a clone method
  clone() {
    // Create a new instance of the piece
    const clonedPiece = new this.constructor(
      this.matrixPosition.x,
      this.matrixPosition.y,
      this.white
    );
    clonedPiece.taken = this.taken;
    return clonedPiece;
  }

  // Override this in specific pieces
  canMove(x, y, board) {
    return false; // Default is false unless overridden
  }

  generateMoves(board) {
    return []; // Override in specific pieces
  }
}

// Board class
class Board {
  constructor(pieces) {
    this.pieces = pieces;
  }

  getPieceAt(x, y) {
    return this.pieces.find(
      (piece) => piece.matrixPosition.x === x && piece.matrixPosition.y === y
    );
  }

  move(from, to) {
    const pieceToMove = this.getPieceAt(from.x, from.y);

    if (!pieceToMove) {
      console.error("No piece found at the source position:", from);
      return;
    }

    const targetPiece = this.getPieceAt(to.x, to.y);

    if (targetPiece && targetPiece.white !== pieceToMove.white) {
      this.pieces = this.pieces.filter((p) => p !== targetPiece);
    }

    pieceToMove.move(to.x, to.y);
  }

  clone() {
    const clonedPieces = this.pieces.map((piece) => piece.clone());
    return new Board(clonedPieces);
  }
}

// Pawn class
class Pawn extends Piece {
  canMove(x, y, board) {
    const direction = this.white ? -1 : 1; // White moves "up", black moves "down"
    const startRow = this.white ? 6 : 1;

    // Move forward by 1 square if empty
    if (x === this.matrixPosition.x && y === this.matrixPosition.y + direction && !board.getPieceAt(x, y)) {
      return true;
    }

    // Move forward by 2 squares from starting row if empty
    if (x === this.matrixPosition.x && y === this.matrixPosition.y + 2 * direction && this.matrixPosition.y === startRow && !board.getPieceAt(x, y)) {
      return true;
    }

    // Capture diagonally
    if (Math.abs(x - this.matrixPosition.x) === 1 && y === this.matrixPosition.y + direction) {
      const target = board.getPieceAt(x, y);
      return target && target.white !== this.white;
    }

    return false;
  }

  generateMoves(board) {
    const moves = [];
    const direction = this.white ? -1 : 1; // White moves "up", black moves "down"

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
  canMove(x, y, board) {
    if (x !== this.matrixPosition.x && y !== this.matrixPosition.y) return false; // Not a straight line move

    const directionX = x > this.matrixPosition.x ? 1 : x < this.matrixPosition.x ? -1 : 0;
    const directionY = y > this.matrixPosition.y ? 1 : y < this.matrixPosition.y ? -1 : 0;

    let checkX = this.matrixPosition.x + directionX;
    let checkY = this.matrixPosition.y + directionY;

    // Check if there are any pieces blocking the move
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
      { dx: 1, dy: 0 }, // Right
      { dx: -1, dy: 0 }, // Left
      { dx: 0, dy: 1 }, // Up
      { dx: 0, dy: -1 } // Down
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
  canMove(x, y, board) {
    const dx = Math.abs(this.matrixPosition.x - x);
    const dy = Math.abs(this.matrixPosition.y - y);

    // Knights move in L shape
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
      const target = board.getPieceAt(x, y);
      return !target || target.white !== this.white;
    }

    return false;
  }

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
  canMove(x, y, board) {
    if (Math.abs(x - this.matrixPosition.x) !== Math.abs(y - this.matrixPosition.y)) return false; // Not a diagonal move

    const directionX = x > this.matrixPosition.x ? 1 : -1;
    const directionY = y > this.matrixPosition.y ? 1 : -1;

    let checkX = this.matrixPosition.x + directionX;
    let checkY = this.matrixPosition.y + directionY;

    // Check if there are any pieces blocking the move
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
      { dx: 1, dy: 1 }, // Top-right diagonal
      { dx: -1, dy: 1 }, // Top-left diagonal
      { dx: 1, dy: -1 }, // Bottom-right diagonal
      { dx: -1, dy: -1 } // Bottom-left diagonal
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
  canMove(x, y, board) {
    // Queen moves like both a rook and a bishop
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
    return this.white ? '♕' : '♛';
  }
}

// King class
class King extends Piece {
  canMove(x, y, board) {
    const dx = Math.abs(this.matrixPosition.x - x);
    const dy = Math.abs(this.matrixPosition.y - y);

    // King moves one square in any direction
    if (dx <= 1 && dy <= 1) {
      const target = board.getPieceAt(x, y);
      return !target || target.white !== this.white;
    }

    return false;
  }

  generateMoves(board) {
    const moves = [];
    const kingMoves = [
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, // Left and right
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // Up and down
      { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, // Diagonals
      { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
    ];

    for (let { dx, dy } of kingMoves) {
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
