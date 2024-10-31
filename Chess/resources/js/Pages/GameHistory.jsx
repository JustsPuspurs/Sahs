import React from 'react';

const MoveList = ({ moves }) => {
  return (
    <div className="move-list">
      <h3>Game Moves</h3>
      <ul>
        {moves.map((move, index) => (
          <li key={index}>{move}</li>
        ))}
      </ul>
    </div>
  );
};

export default MoveList;
