import React, { useState } from 'react';
import axios from 'axios';

import BluePawn from '../../Images/BluePawn.png';
import BlueRook from '../../Images/BlueRook.png';
import BlueKnight from '../../Images/BlueKnight.png';
import BlueBishop from '../../Images/BlueBishop.png';
import BlueQueen from '../../Images/BlueQueen.png';
import BlueKing from '../../Images/BlueKing.png';

const imageMapping = {
  'images/blue_pawn.png': BluePawn,
  'images/blue_rook.png': BlueRook,
  'images/blue_knight.png': BlueKnight,
  'images/blue_bishop.png': BlueBishop,
  'images/blue_queen.png': BlueQueen,
  'images/blue_king.png': BlueKing,
};

const Shop = ({ isOpen, onClose, skins = [], walletCoins = 0, ownedSkins = [], onPurchase, onEquip }) => {
  if (!isOpen) return null;

  const [message, setMessage] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // adjust as needed
  const totalPages = Math.ceil(skins.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkins = skins.slice(indexOfFirstItem, indexOfLastItem);

  const getOwnedData = (skinId) => ownedSkins.find((skin) => skin.id === skinId);

  const purchaseSkin = (skinId, cost, skin) => {
    axios.post(`/skins/${skinId}/purchase`)
      .then(response => {
        setMessage(response.data.message);
        if (onPurchase) onPurchase(cost, skin);
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Error purchasing skin.');
      });
  };

  const equipSkin = (skinId, skin) => {
    axios.post(`/skins/${skinId}/equip`)
      .then(response => {
        setMessage(response.data.message);
        if (onEquip) onEquip(skin, true);
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Error equipping skin.');
      });
  };

  const unequipSkin = (skinId, skin) => {
    axios.post(`/skins/${skinId}/unequip`)
      .then(response => {
        setMessage(response.data.message);
        if (onEquip) onEquip(skin, false);
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Error unequipping skin.');
      });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="modal">
      <div className="modal-content shop-modal-content">
        <div className="close-button-container">
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <h2>Skin Shop</h2>
        <p>Your Coins: {walletCoins}</p>
        {message && <p>{message}</p>}
        <div className="scrollable-skins">
          <div className="skin-list shop-skin-list">
            {currentSkins.map((skin) => {
              const owned = getOwnedData(skin.id);
              return (
                <div key={skin.id} className="skin-item">
                  {skin.image && imageMapping[skin.image] ? (
                    <img
                      src={imageMapping[skin.image]}
                      alt={skin.name}
                      className="shop-skin-image"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                  <h3>{skin.name}</h3>
                  <p>Type: {skin.piece_type}</p>
                  <p>Cost: {skin.cost} coins</p>
                  {owned ? (
                    owned.pivot && owned.pivot.equipped ? (
                      <button className="custom-button-shop" onClick={() => unequipSkin(skin.id, skin)}>Unequip</button>
                    ) : (
                      <button className="custom-button-shop" onClick={() => equipSkin(skin.id, skin)}>Equip</button>
                    )
                  ) : (
                    <button className="custom-button-shop" onClick={() => purchaseSkin(skin.id, skin.cost, skin)}>Buy Skin</button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="pagination">
            <button onClick={goToPrevPage} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;