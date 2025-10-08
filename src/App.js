import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Fireworks from './Fireworks';

function App() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [playerTier, setPlayerTier] = useState('Bronze');
  const [teams, setTeams] = useState({ team1: [], team2: [] });
  const [showTeams, setShowTeams] = useState(false);
  const [sortByTier, setSortByTier] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  const [currentFlipIndex, setCurrentFlipIndex] = useState(0);
  const [totalFlipGroups, setTotalFlipGroups] = useState(0);
  const [fireworks, setFireworks] = useState([]);

  // Refs cho audio elements
  const backgroundMusicRef = useRef(null);
  const flipSoundRef = useRef(null);
  const victorySoundRef = useRef(null);
  const autoFlipIntervalRef = useRef(null);

  // Định nghĩa các tier và điểm số
  const tiers = {
    'Bronze': { value: 1, color: '#CD7F32', icon: '🥉' },
    'Silver': { value: 2, color: '#C0C0C0', icon: '🥈' },
    'Gold': { value: 3, color: '#FFD700', icon: '🥇' },
    'Diamond': { value: 4, color: '#B9F2FF', icon: '💎' },
    'Master': { value: 5, color: '#8A2BE2', icon: '👑' }
  };

  // Thêm người chơi
  const addPlayer = () => {
    if (playerName.trim()) {
      const playerExists = players.some(player => player.name === playerName.trim());
      if (!playerExists) {
        const newPlayer = {
          name: playerName.trim(),
          tier: playerTier,
          tierValue: tiers[playerTier].value
        };
        setPlayers([...players, newPlayer]);
        setPlayerName('');
        setPlayerTier('Bronze');
      }
    }
  };

  // Xóa người chơi
  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    setShowTeams(false);
  };

  // Chia đội cân bằng dựa trên tier
  const divideTeams = () => {
    if (players.length < 2) {
      alert('Cần ít nhất 2 người chơi để chia đội!');
      return;
    }

    // Sắp xếp người chơi theo tier (cao nhất trước)
    const sortedPlayers = [...players].sort((a, b) => b.tierValue - a.tierValue);
    
    const team1 = [];
    const team2 = [];
    let team1Score = 0;
    let team2Score = 0;

    // Thuật toán chia đội cân bằng
    sortedPlayers.forEach(player => {
      if (team1Score <= team2Score) {
        team1.push(player);
        team1Score += player.tierValue;
      } else {
        team2.push(player);
        team2Score += player.tierValue;
      }
    });

    // Nếu chênh lệch quá lớn, điều chỉnh
    if (Math.abs(team1Score - team2Score) > 2 && players.length > 4) {
      // Tìm cặp người chơi có thể đổi để cân bằng hơn
      for (let i = 0; i < Math.min(team1.length, team2.length); i++) {
        const tempTeam1Score = team1Score - team1[i].tierValue + team2[i].tierValue;
        const tempTeam2Score = team2Score - team2[i].tierValue + team1[i].tierValue;
        
        if (Math.abs(tempTeam1Score - tempTeam2Score) < Math.abs(team1Score - team2Score)) {
          [team1[i], team2[i]] = [team2[i], team1[i]];
          team1Score = tempTeam1Score;
          team2Score = tempTeam2Score;
          break;
        }
      }
    }

    setTeams({ team1, team2 });
    setShowTeams(true);
    
    // Reset animation states khi chia đội mới
    setFlippedCards({});
    setAllCardsFlipped(false);
    
    // Phát âm thanh chiến thắng
    playVictorySound();
  };

  // Chia lại đội
  const reshuffleTeams = () => {
    divideTeams();
  };

  // Reset tất cả
  const resetAll = () => {
    setPlayers([]);
    setTeams({ team1: [], team2: [] });
    setShowTeams(false);
    setPlayerName('');
    setPlayerTier('Bronze');
    setFlippedCards({});
    setAllCardsFlipped(false);
    stopAutoFlip();
  };

  // Tính tổng điểm tier của đội
  const calculateTeamScore = (team) => {
    return team.reduce((sum, player) => sum + player.tierValue, 0);
  };

  // Lấy danh sách người chơi đã sắp xếp
  const getSortedPlayers = () => {
    if (sortByTier) {
      return [...players].sort((a, b) => b.tierValue - a.tierValue);
    }
    return players;
  };

  // Lật card riêng lẻ
  const flipCard = (playerName, event) => {
    setFlippedCards(prev => ({
      ...prev,
      [playerName]: !prev[playerName]
    }));
    
    // Phát âm thanh khi lật card
    playFlipSound();
    
    // Trigger pháo hoa tại vị trí card
    if (event && event.currentTarget) {
      const position = getCardPosition(event.currentTarget);
      triggerFireworks(position);
    }
  };

  // Lật tất cả card
  const flipAllCards = () => {
    setAllCardsFlipped(!allCardsFlipped);
    const newFlippedCards = {};
    [...teams.team1, ...teams.team2].forEach(player => {
      newFlippedCards[player.name] = !allCardsFlipped;
    });
    setFlippedCards(newFlippedCards);
    
    // Trigger pháo hoa ở giữa màn hình khi lật tất cả
    if (!allCardsFlipped) {
      triggerFireworks({ x: 50, y: 50 });
    }
  };

  // Kiểm tra card có được lật không
  const isCardFlipped = (playerName) => {
    return flippedCards[playerName] || allCardsFlipped;
  };

  // Hàm xử lý âm thanh
  const playBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume;
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.play().catch(e => console.log('Cannot play music:', e));
      setIsMusicPlaying(true);
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  };

  const playFlipSound = () => {
    if (flipSoundRef.current) {
      flipSoundRef.current.volume = volume * 0.3;
      flipSoundRef.current.play().catch(e => console.log('Cannot play flip sound:', e));
    }
  };

  const playVictorySound = () => {
    if (victorySoundRef.current) {
      victorySoundRef.current.volume = volume;
      victorySoundRef.current.play().catch(e => console.log('Cannot play victory sound:', e));
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = newVolume;
    }
  };

  // Hàm trigger pháo hoa
  const triggerFireworks = (position = { x: 50, y: 50 }) => {
    const fireworkId = Date.now() + Math.random();
    setFireworks(prev => [...prev, { id: fireworkId, position, trigger: true }]);
    
    // Remove firework after animation
    setTimeout(() => {
      setFireworks(prev => prev.filter(fw => fw.id !== fireworkId));
    }, 2500);
  };

  // Hàm lấy vị trí card để hiển thị pháo hoa
  const getCardPosition = (cardElement) => {
    if (!cardElement) return { x: 50, y: 50 };
    
    const rect = cardElement.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    
    return { x, y };
  };

  // Hàm xử lý auto-flip theo tier
  const startAutoFlip = () => {
    if (isAutoFlipping) return;
    
    setIsAutoFlipping(true);
    setCurrentFlipIndex(0);
    
    // Reset tất cả card về trạng thái chưa lật
    const allPlayers = [...teams.team1, ...teams.team2];
    const resetFlippedCards = {};
    allPlayers.forEach(player => {
      resetFlippedCards[player.name] = false;
    });
    setFlippedCards(resetFlippedCards);
    setAllCardsFlipped(false);
    
    // Nhóm players theo tier
    const playersByTier = {};
    allPlayers.forEach(player => {
      if (!playersByTier[player.tier]) {
        playersByTier[player.tier] = [];
      }
      playersByTier[player.tier].push(player);
    });
    
    // Tạo danh sách các tier để lật (từ cao xuống thấp)
    const tierOrder = ['Master', 'Diamond', 'Gold', 'Silver', 'Bronze'];
    const flipGroups = [];
    
    tierOrder.forEach(tier => {
      if (playersByTier[tier]) {
        const players = playersByTier[tier];
        // Chia thành các nhóm 2 (hoặc 1 nếu lẻ)
        for (let i = 0; i < players.length; i += 2) {
          flipGroups.push(players.slice(i, i + 2));
        }
      }
    });
    
    // Lưu tổng số nhóm để hiển thị progress
    setTotalFlipGroups(flipGroups.length);
    
    // Bắt đầu interval để lật theo nhóm tier
    autoFlipIntervalRef.current = setInterval(() => {
      setCurrentFlipIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (nextIndex <= flipGroups.length) {
          // Lật nhóm card tiếp theo (cùng tier)
          const groupToFlip = flipGroups[nextIndex - 1];
          if (groupToFlip && groupToFlip.length > 0) {
            setFlippedCards(prev => {
              const newFlipped = { ...prev };
              groupToFlip.forEach(player => {
                newFlipped[player.name] = true;
              });
              return newFlipped;
            });
            
            // Phát âm thanh và pháo hoa cho mỗi card trong nhóm
            groupToFlip.forEach((player, index) => {
              setTimeout(() => {
                playFlipSound();
                
                // Trigger pháo hoa với delay nhỏ giữa các card
                setTimeout(() => {
                  // Tính vị trí pháo hoa dựa trên vị trí card trong team
                  let position = { x: 50, y: 50 };
                  
                  if (teams.team1.includes(player)) {
                    position = { x: 25, y: 60 + (teams.team1.indexOf(player) * 10) };
                  } else if (teams.team2.includes(player)) {
                    position = { x: 75, y: 60 + (teams.team2.indexOf(player) * 10) };
                  }
                  
                  triggerFireworks(position);
                }, index * 100);
              }, index * 200); // Delay nhỏ giữa các âm thanh
            });
          }
          
          // Nếu đã lật hết, dừng interval
          if (nextIndex === flipGroups.length) {
            setTimeout(() => {
              setIsAutoFlipping(false);
              if (autoFlipIntervalRef.current) {
                clearInterval(autoFlipIntervalRef.current);
                autoFlipIntervalRef.current = null;
              }
            }, 1000);
          }
        }
        
        return nextIndex;
      });
    }, 3000);
  };

  const stopAutoFlip = () => {
    setIsAutoFlipping(false);
    setCurrentFlipIndex(0);
    setTotalFlipGroups(0);
    if (autoFlipIntervalRef.current) {
      clearInterval(autoFlipIntervalRef.current);
      autoFlipIntervalRef.current = null;
    }
  };

  // Cleanup interval khi component unmount
  useEffect(() => {
    return () => {
      if (autoFlipIntervalRef.current) {
        clearInterval(autoFlipIntervalRef.current);
      }
    };
  }, []);

  // Xử lý phím Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">⚽ DX Soccer</h1>
        
        {/* Điều khiển âm thanh */}
        <div className="audio-controls">
          <div className="audio-controls-group">
            <button 
              onClick={toggleMusic} 
              className={`music-toggle-btn ${isMusicPlaying ? 'playing' : ''}`}
            >
              {isMusicPlaying ? '🔊' : '🔇'} 
              {isMusicPlaying ? 'Tắt Nhạc' : 'Bật Nhạc'}
            </button>
            
            <div className="volume-control">
              <span>🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span>{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
        
        {/* Form thêm người chơi */}
        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tên tuyển thủ..."
              className="player-input"
            />
            <select
              value={playerTier}
              onChange={(e) => setPlayerTier(e.target.value)}
              className="tier-select"
            >
              {Object.entries(tiers).map(([tier, config]) => (
                <option key={tier} value={tier}>
                  {config.icon} {tier}
                </option>
              ))}
            </select>
            <button onClick={addPlayer} className="add-btn">
              Thêm
            </button>
          </div>
        </div>

        {/* Danh sách người chơi */}
        {players.length > 0 && (
          <div className="players-section">
            <div className="players-header">
              <h3>Tuyển thủ ({players.length})</h3>
              <label className="sort-toggle">
                <input
                  type="checkbox"
                  checked={sortByTier}
                  onChange={(e) => setSortByTier(e.target.checked)}
                />
                Sắp xếp theo tier
              </label>
            </div>
            <div className="players-list">
              {getSortedPlayers().map((player, index) => {
                const originalIndex = players.findIndex(p => p.name === player.name);
                return (
                  <div key={player.name} className="player-item">
                    <div className="player-info">
                      <span className="player-name">{player.name}</span>
                      <span 
                        className="player-tier"
                        style={{ color: tiers[player.tier].color }}
                      >
                        {tiers[player.tier].icon} {player.tier}
                      </span>
                    </div>
                    <button 
                      onClick={() => removePlayer(originalIndex)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nút điều khiển */}
        {players.length >= 2 && (
          <div className="control-buttons">
            <button onClick={divideTeams} className="divide-btn">
              Chia Đội
            </button>
            <button onClick={resetAll} className="reset-btn">
              Reset Tất Cả
            </button>
          </div>
        )}

        {/* Hiển thị kết quả chia đội */}
        {showTeams && (
          <div className="teams-section">
            {/* Nút điều khiển animation */}
            <div className="animation-controls">
              <div className="animation-buttons">
                <button 
                  onClick={startAutoFlip} 
                  className="auto-flip-btn"
                  disabled={isAutoFlipping}
                >
                  {isAutoFlipping ? '⏳ Đang Lật...' : '🎬 Bắt Đầu Lật'}
                </button>
                
                {isAutoFlipping && (
                  <button onClick={stopAutoFlip} className="stop-auto-flip-btn">
                    ⏹️ Dừng
                  </button>
                )}
                
                <button onClick={flipAllCards} className="flip-all-btn">
                  {allCardsFlipped ? '🔄 Ẩn Tất Cả' : '👁️ Lật Tất Cả'}
                </button>
              </div>
              
              {isAutoFlipping && (
                <div className="auto-flip-progress">
                  <div className="progress-text">
                    Đang lật nhóm tier {currentFlipIndex} / {totalFlipGroups}
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${totalFlipGroups > 0 ? ((currentFlipIndex) / totalFlipGroups) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="progress-subtext">
                    Lật cùng lúc các tuyển thủ cùng tier
                  </div>
                </div>
              )}
            </div>

            <div className="teams-container">
              <div className="team">
                <h3 className="team-title team1">
                  Đội 1 ({teams.team1.length}) - Điểm: {calculateTeamScore(teams.team1)}
                </h3>
                <div className="team-members">
                  {teams.team1.map((player, index) => (
                    <div 
                      key={index} 
                      className={`team-member team1-member card ${isCardFlipped(player.name) ? 'flipped' : ''}`}
                      onClick={(e) => flipCard(player.name, e)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-inner">
                        <div className="card-front">
                          <div className="card-back-content">
                            <span className="question-mark">?</span>
                          </div>
                        </div>
                        <div className="card-back">
                          <div className="member-info">
                            <span className="member-name">{player.name}</span>
                            <span 
                              className="member-tier"
                              style={{ color: tiers[player.tier].color }}
                            >
                              {tiers[player.tier].icon} {player.tier}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="vs-divider">VS</div>
              
              <div className="team">
                <h3 className="team-title team2">
                  Đội 2 ({teams.team2.length}) - Điểm: {calculateTeamScore(teams.team2)}
                </h3>
                <div className="team-members">
                  {teams.team2.map((player, index) => (
                    <div 
                      key={index} 
                      className={`team-member team2-member card ${isCardFlipped(player.name) ? 'flipped' : ''}`}
                      onClick={(e) => flipCard(player.name, e)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-inner">
                        <div className="card-front">
                          <div className="card-back-content">
                            <span className="question-mark">?</span>
                          </div>
                        </div>
                        <div className="card-back">
                          <div className="member-info">
                            <span className="member-name">{player.name}</span>
                            <span 
                              className="member-tier"
                              style={{ color: tiers[player.tier].color }}
                            >
                              {tiers[player.tier].icon} {player.tier}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button onClick={reshuffleTeams} className="reshuffle-btn">
              Chia Lại Đội
            </button>
          </div>
        )}
      </div>
      
      {/* Audio Elements */}
      <audio 
        ref={backgroundMusicRef} 
        preload="auto"
        src="/audio/Uefa Champions League Anthem - 24_25.mp3"
      />
      <audio 
        ref={flipSoundRef} 
        preload="auto"
        src="/audio/flip-sound.mp3"
      />
      <audio 
        ref={victorySoundRef} 
        preload="auto"
        src="/audio/victory.mp3"
      />
      
      {/* Fireworks */}
      {fireworks.map(firework => (
        <Fireworks
          key={firework.id}
          trigger={firework.trigger}
          position={firework.position}
        />
      ))}
    </div>
  );
}

export default App;
