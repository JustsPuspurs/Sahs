import React, { useState } from 'react';
import axios from 'axios';

const Shop = ({ isOpen, onClose, skins = [], walletCoins = 0, onPurchase }) => {
  if (!isOpen) return null;

  const [message, setMessage] = useState('');
  const purchaseSkin = (skinId, cost) => {
    axios.post(`/skins/${skinId}/purchase`)
      .then(response => {
        setMessage(response.data.message);
        if (onPurchase) {
          onPurchase(cost);
        }
      })
      .catch(error => {
        setMessage(
          error.response?.data?.message || 'Error purchasing skin.'
        );
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="close-button-container">
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <h2>Skin Shop</h2>
        <p>Your Coins: {walletCoins}</p>
        {message && <p>{message}</p>}
        <div className="skin-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {skins.map((skin) => (
            <div
              key={skin.id}
              className="skin-item"
              style={{
                border: '1px solid #ccc',
                margin: '10px',
                padding: '10px',
                width: '150px',
              }}
            >
              {skin.image && (
                <img
                  src={skin.image}
                  alt={skin.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                />
              )}
              <h3>{skin.name}</h3>
              <p>Type: {skin.piece_type}</p>
              <p>Cost: {skin.cost} coins</p>
              <button onClick={() => purchaseSkin(skin.id, skin.cost)}>
                Buy Skin
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;