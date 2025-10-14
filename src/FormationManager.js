import React, { useState, useEffect } from 'react';
import './FormationManager.css';

const FormationManager = ({ 
  isOpen, 
  onClose, 
  teams, 
  onFormationChange,
  currentFormations = { team1: null, team2: null }
}) => {
  const [selectedTeam, setSelectedTeam] = useState('team1');
  const [selectedFormation, setSelectedFormation] = useState('4-4-2');
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [formations, setFormations] = useState({
    team1: currentFormations.team1 || {},
    team2: currentFormations.team2 || {}
  });

  // Định nghĩa các sơ đồ mẫu
  const formationTemplates = {
    '4-4-2': {
      name: '4-4-2',
      positions: [
        { id: 'gk', x: 50, y: 90, name: 'Thủ môn', required: true },
        { id: 'lb', x: 20, y: 70, name: 'Hậu vệ trái' },
        { id: 'cb1', x: 40, y: 70, name: 'Trung vệ 1' },
        { id: 'cb2', x: 60, y: 70, name: 'Trung vệ 2' },
        { id: 'rb', x: 80, y: 70, name: 'Hậu vệ phải' },
        { id: 'lm', x: 20, y: 50, name: 'Tiền vệ trái' },
        { id: 'cm1', x: 40, y: 50, name: 'Tiền vệ 1' },
        { id: 'cm2', x: 60, y: 50, name: 'Tiền vệ 2' },
        { id: 'rm', x: 80, y: 50, name: 'Tiền vệ phải' },
        { id: 'st1', x: 40, y: 25, name: 'Tiền đạo 1' },
        { id: 'st2', x: 60, y: 25, name: 'Tiền đạo 2' }
      ]
    },
    '4-3-3': {
      name: '4-3-3',
      positions: [
        { id: 'gk', x: 50, y: 90, name: 'Thủ môn', required: true },
        { id: 'lb', x: 20, y: 70, name: 'Hậu vệ trái' },
        { id: 'cb1', x: 40, y: 70, name: 'Trung vệ 1' },
        { id: 'cb2', x: 60, y: 70, name: 'Trung vệ 2' },
        { id: 'rb', x: 80, y: 70, name: 'Hậu vệ phải' },
        { id: 'cm1', x: 30, y: 50, name: 'Tiền vệ 1' },
        { id: 'cm2', x: 50, y: 50, name: 'Tiền vệ 2' },
        { id: 'cm3', x: 70, y: 50, name: 'Tiền vệ 3' },
        { id: 'lw', x: 20, y: 25, name: 'Tiền đạo cánh trái' },
        { id: 'st', x: 50, y: 25, name: 'Tiền đạo trung tâm' },
        { id: 'rw', x: 80, y: 25, name: 'Tiền đạo cánh phải' }
      ]
    },
    '3-5-2': {
      name: '3-5-2',
      positions: [
        { id: 'gk', x: 50, y: 90, name: 'Thủ môn', required: true },
        { id: 'cb1', x: 30, y: 70, name: 'Trung vệ 1' },
        { id: 'cb2', x: 50, y: 70, name: 'Trung vệ 2' },
        { id: 'cb3', x: 70, y: 70, name: 'Trung vệ 3' },
        { id: 'lm', x: 15, y: 50, name: 'Tiền vệ trái' },
        { id: 'cm1', x: 35, y: 50, name: 'Tiền vệ 1' },
        { id: 'cm2', x: 50, y: 50, name: 'Tiền vệ 2' },
        { id: 'cm3', x: 65, y: 50, name: 'Tiền vệ 3' },
        { id: 'rm', x: 85, y: 50, name: 'Tiền vệ phải' },
        { id: 'st1', x: 40, y: 25, name: 'Tiền đạo 1' },
        { id: 'st2', x: 60, y: 25, name: 'Tiền đạo 2' }
      ]
    },
    '5-3-2': {
      name: '5-3-2',
      positions: [
        { id: 'gk', x: 50, y: 90, name: 'Thủ môn', required: true },
        { id: 'lb', x: 15, y: 70, name: 'Hậu vệ trái' },
        { id: 'cb1', x: 35, y: 70, name: 'Trung vệ 1' },
        { id: 'cb2', x: 50, y: 70, name: 'Trung vệ 2' },
        { id: 'cb3', x: 65, y: 70, name: 'Trung vệ 3' },
        { id: 'rb', x: 85, y: 70, name: 'Hậu vệ phải' },
        { id: 'cm1', x: 30, y: 50, name: 'Tiền vệ 1' },
        { id: 'cm2', x: 50, y: 50, name: 'Tiền vệ 2' },
        { id: 'cm3', x: 70, y: 50, name: 'Tiền vệ 3' },
        { id: 'st1', x: 40, y: 25, name: 'Tiền đạo 1' },
        { id: 'st2', x: 60, y: 25, name: 'Tiền đạo 2' }
      ]
    }
  };

  // Khởi tạo sơ đồ khi thay đổi formation
  useEffect(() => {
    if (formationTemplates[selectedFormation]) {
      const template = formationTemplates[selectedFormation];
      const newFormation = {};
      
      template.positions.forEach(pos => {
        newFormation[pos.id] = {
          ...pos,
          player: formations[selectedTeam][pos.id]?.player || null
        };
      });
      
      setFormations(prev => ({
        ...prev,
        [selectedTeam]: newFormation
      }));
    }
  }, [selectedFormation, selectedTeam]);

  // Xử lý kéo thả
  const handleDragStart = (e, player) => {
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, positionId) => {
    e.preventDefault();
    
    if (draggedPlayer) {
      const currentTeam = teams[selectedTeam];
      const player = currentTeam.find(p => p.name === draggedPlayer.name);
      
      if (player) {
        setFormations(prev => {
          const newFormations = { ...prev };
          
          // Xóa player khỏi vị trí cũ (nếu có)
          Object.keys(newFormations[selectedTeam]).forEach(posId => {
            if (newFormations[selectedTeam][posId].player?.name === player.name) {
              newFormations[selectedTeam][posId].player = null;
            }
          });
          
          // Thêm player vào vị trí mới
          newFormations[selectedTeam][positionId].player = player;
          
          return newFormations;
        });
      }
    }
    
    setDraggedPlayer(null);
  };

  // Xóa player khỏi vị trí
  const removePlayerFromPosition = (positionId) => {
    setFormations(prev => ({
      ...prev,
      [selectedTeam]: {
        ...prev[selectedTeam],
        [positionId]: {
          ...prev[selectedTeam][positionId],
          player: null
        }
      }
    }));
  };

  // Lưu sơ đồ
  const saveFormations = () => {
    onFormationChange(formations);
    onClose();
  };

  // Reset sơ đồ
  const resetFormation = () => {
    setFormations(prev => ({
      ...prev,
      [selectedTeam]: {}
    }));
  };

  if (!isOpen) return null;

  const currentTeam = teams[selectedTeam] || [];
  const currentFormation = formations[selectedTeam] || {};
  const template = formationTemplates[selectedFormation];

  return (
    <div className="formation-overlay">
      <div className="formation-modal">
        <div className="formation-header">
          <h2>⚽ Quản Lý Sơ Đồ</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="formation-controls">
          <div className="team-selector">
            <button 
              className={`team-btn ${selectedTeam === 'team1' ? 'active' : ''}`}
              onClick={() => setSelectedTeam('team1')}
            >
              Đội 1 ({currentTeam.length})
            </button>
            <button 
              className={`team-btn ${selectedTeam === 'team2' ? 'active' : ''}`}
              onClick={() => setSelectedTeam('team2')}
            >
              Đội 2 ({teams.team2?.length || 0})
            </button>
          </div>

          <div className="formation-selector">
            <label>Sơ đồ:</label>
            <select 
              value={selectedFormation} 
              onChange={(e) => setSelectedFormation(e.target.value)}
            >
              {Object.keys(formationTemplates).map(formation => (
                <option key={formation} value={formation}>
                  {formationTemplates[formation].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="formation-content">
          <div className="players-panel">
            <h3>Cầu thủ chưa xếp</h3>
            <div className="players-list">
              {currentTeam
                .filter(player => 
                  !Object.values(currentFormation).some(pos => pos.player?.name === player.name)
                )
                .map(player => (
                  <div
                    key={player.name}
                    className="player-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, player)}
                  >
                    <span className="player-name">{player.name}</span>
                    <span className="player-tier">{player.tier}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="field-container">
            <div className="football-field">
              <div className="field-lines">
                <div className="center-circle"></div>
                <div className="center-line"></div>
                <div className="penalty-area penalty-area-top"></div>
                <div className="penalty-area penalty-area-bottom"></div>
                <div className="goal-area goal-area-top"></div>
                <div className="goal-area goal-area-bottom"></div>
              </div>
              
              {template && template.positions.map(position => (
                <div
                  key={position.id}
                  className={`position ${currentFormation[position.id]?.player ? 'occupied' : 'empty'}`}
                  style={{ 
                    left: `${position.x}%`, 
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, position.id)}
                >
                  {currentFormation[position.id]?.player ? (
                    <div className="position-player">
                      <span className="player-name">
                        {currentFormation[position.id].player.name}
                      </span>
                      <button 
                        className="remove-player"
                        onClick={() => removePlayerFromPosition(position.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="position-placeholder">
                      <span className="position-name">{position.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="formation-actions">
          <button onClick={resetFormation} className="reset-btn">
            🔄 Reset Sơ Đồ
          </button>
          <button onClick={saveFormations} className="save-btn">
            💾 Lưu Sơ Đồ
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormationManager;
