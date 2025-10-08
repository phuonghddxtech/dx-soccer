import React, { useState, useEffect } from 'react';
import './Fireworks.css';

const Fireworks = ({ trigger, position = { x: 50, y: 50 } }) => {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      generateParticles();
      
      // Hide after animation completes
      const timer = setTimeout(() => {
        setShow(false);
        setParticles([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const generateParticles = () => {
    const newParticles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 2 + Math.random() * 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push({
        id: i,
        angle,
        velocity,
        color,
        size: 3 + Math.random() * 4,
        life: 1.0
      });
    }
    
    setParticles(newParticles);
  };

  if (!show) return null;

  return (
    <div 
      className="fireworks-container"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="firework-particle"
          style={{
            '--angle': `${particle.angle}rad`,
            '--velocity': `${particle.velocity}`,
            '--color': particle.color,
            '--size': `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks;
