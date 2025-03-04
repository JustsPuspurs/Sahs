import React, { useState } from 'react';
import axios from 'axios';
// Import images from your resources folder (adjust paths as necessary)
import ClassicPawn from '../../Images/classic_pawn.png';
import GoldenRook from '../../Images/golden_rook.png';

// Create a mapping from the database image path to the imported image module
const imageMapping = {
  'images/classic_pawn.png': ClassicPawn,
  'images/golden_rook.png': GoldenRook,
};

const Shop = ({ isOpen, onClose, skins = [], walletCoins = 0, ownedSkins = [], onPurchase, onEquip }) => {
  if (!isOpen) return null;

  const [message, setMessage] = useState('');

  // Helper: return the owned skin data (including pivot) if owned.
  const getOwnedData = (skinId) => {
    return ownedSkins.find((skin) => skin.id === skinId);
  };

  const purchaseSkin = (skinId, cost, skin) => {
    axios.post(`/skins/${skinId}/purchase`)
      .then(response => {
        setMessage(response.data.message);
        if (onPurchase) {
          onPurchase(cost, skin);
        }
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Error purchasing skin.');
      });
  };

  const equipSkin = (skinId, skin) => {
    axios.post(`/skins/${skinId}/equip`)
      .then(response => {
        setMessage(response.data.message);
        if (onEquip) {
          onEquip(skin, true);
        }
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Error equipping skin.');
      });
  };

  const unequipSkin = (skinId, skin) => {
    axios.post(`/skins/${skinId}/unequip`)
      .then(response => {
        setMessage(response.data.message);
        if (onEquip) {
          onEquip(skin, false);
        }
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Error unequipping skin.');
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
          {skins.map((skin) => {
            const owned = getOwnedData(skin.id);
            return (
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
                {skin.image && imageMapping[skin.image] ? (
                  <img
                    src={imageMapping[skin.image]}
                    alt={skin.name}
                    style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <p>No Image</p>
                )}
                <h3>{skin.name}</h3>
                <p>Type: {skin.piece_type}</p>
                <p>Cost: {skin.cost} coins</p>
                {owned ? (
                  owned.pivot && owned.pivot.equipped ? (
                    <button onClick={() => unequipSkin(skin.id, skin)}>
                      Unequip
                    </button>
                  ) : (
                    <button onClick={() => equipSkin(skin.id, skin)}>
                      Equip
                    </button>
                  )
                ) : (
                  <button onClick={() => purchaseSkin(skin.id, skin.cost, skin)}>
                    Buy Skin
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;