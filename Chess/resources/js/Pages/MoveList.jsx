import React from 'react';

const MoveList = ({ movePairs }) => {
  return (
    <div className="move-list">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>White</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Black</th>
          </tr>
        </thead>
        <tbody>
          {movePairs.map((pair, index) => (
            <tr key={index}>
              <td style={{ padding: '4px 8px' }}>{pair.white}</td>
              <td style={{ padding: '4px 8px' }}>{pair.black}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MoveList;