import React, { useState, useEffect } from 'react';
import './TierManager.css';

const TierManager = ({ isOpen, onClose, currentTiers, onSave, onReset }) => {
  const [tiers, setTiers] = useState([]);
  const [newTierName, setNewTierName] = useState('');
  const [newTierValue, setNewTierValue] = useState('');
  const [newTierColor, setNewTierColor] = useState('#FF6B6B');
  const [newTierIcon, setNewTierIcon] = useState('🏆');

  useEffect(() => {
    if (isOpen && currentTiers) {
      const tierList = Object.keys(currentTiers).map(name => ({
        name,
        ...currentTiers[name]
      })).sort((a, b) => b.value - a.value);
      setTiers(tierList);
    }
  }, [isOpen, currentTiers]);

  const addTier = () => {
    if (newTierName.trim() && newTierValue !== '') {
      const tierValue = parseFloat(newTierValue);
      const newTier = {
        name: newTierName.trim(),
        value: tierValue,
        color: newTierColor,
        icon: newTierIcon
      };

      setTiers([...tiers, newTier].sort((a, b) => b.value - a.value));
      setNewTierName('');
      setNewTierValue('');
      setNewTierColor('#FF6B6B');
      setNewTierIcon('🏆');
    }
  };

  const removeTier = (index) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    setTiers(newTiers);
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    if (field === 'value') {
      newTiers.sort((a, b) => b.value - a.value);
    }
    setTiers(newTiers);
  };

  const handleSave = () => {
    const tiersObject = {};
    tiers.forEach(tier => {
      tiersObject[tier.name] = {
        value: tier.value,
        color: tier.color,
        icon: tier.icon
      };
    });
    onSave(tiersObject);
    onClose();
  };

  const predefinedColors = [
    '#FF6B6B', '#FFA726', '#CD7F32', '#C0C0C0', '#FFD700',
    '#B9F2FF', '#8A2BE2', '#4CAF50', '#2196F3', '#E91E63'
  ];

  const predefinedIcons = [
    '🐔', '🦆', '🥉', '🥈', '🥇', '💎', '👑', '🏆', '⭐', '🌟',
    '🔥', '💪', '🎯', '⚡', '🚀', '💯', '🎖️', '🏅', '🎪', '🎭'
  ];

  if (!isOpen) return null;

  return (
    <div className="tier-manager-overlay">
      <div className="tier-manager-modal">
        <div className="tier-manager-header">
          <h2>🎯 Set Up List Tier</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="tier-manager-content">
          {/* Add new tier */}
          <div className="add-tier-section">
            <h3>Thêm Tier Mới</h3>
            <div className="add-tier-form">
              <input
                type="text"
                placeholder="Tên tier..."
                value={newTierName}
                onChange={(e) => setNewTierName(e.target.value)}
                className="tier-name-input"
              />
              <input
                type="number"
                placeholder="Điểm số"
                value={newTierValue}
                onChange={(e) => setNewTierValue(e.target.value)}
                step="0.1"
                className="tier-value-input"
              />
              <div className="color-picker">
                <label>Màu:</label>
                <div className="color-options">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${newTierColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTierColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="icon-picker">
                <label>Icon:</label>
                <div className="icon-options">
                  {predefinedIcons.map(icon => (
                    <button
                      key={icon}
                      className={`icon-option ${newTierIcon === icon ? 'selected' : ''}`}
                      onClick={() => setNewTierIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={addTier} className="add-tier-btn">
                ➕ Thêm Tier
              </button>
            </div>
          </div>

          {/* Current tiers */}
          <div className="current-tiers-section">
            <h3>Danh Sách Tier Hiện Tại</h3>
            <div className="tiers-list">
              {tiers.map((tier, index) => (
                <div key={index} className="tier-item">
                  <div className="tier-preview">
                    <span className="tier-icon">{tier.icon}</span>
                    <span 
                      className="tier-name"
                      style={{ color: tier.color }}
                    >
                      {tier.name}
                    </span>
                    <span className="tier-value">({tier.value})</span>
                  </div>
                  <div className="tier-controls">
                    <input
                      type="number"
                      value={tier.value}
                      onChange={(e) => updateTier(index, 'value', parseFloat(e.target.value))}
                      step="0.1"
                      className="edit-value-input"
                    />
                    <button
                      onClick={() => removeTier(index)}
                      className="remove-tier-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tier-manager-footer">
          <div className="save-info">
            <span className="save-icon">💾</span>
            <span className="save-text">Dữ liệu sẽ được lưu tự động</span>
          </div>
          <div className="footer-buttons">
            <button onClick={onReset} className="reset-btn">
              🔄 Reset về Default
            </button>
            <button onClick={handleSave} className="save-btn">
              💾 Lưu Tier List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierManager;
