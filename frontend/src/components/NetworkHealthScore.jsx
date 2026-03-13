import { useState, useEffect } from 'react';

export default function NetworkHealthScore({ data, stats, isConnected }) {
  const [healthScore, setHealthScore] = useState(0);
  const [mood, setMood] = useState('calm');
  const [comparison, setComparison] = useState('');
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const total = (data?.TCP || 0) + (data?.UDP || 0) + (data?.ICMP || 0);
    
    // Calculate health score (0-100)
    let score = 50; // Base score
    
    if (isConnected) score += 20;
    if (total > 0) score += 15;
    if (total > 100) score += 10;
    if (total > 1000) score += 5;
    
    // Balance check (good if protocols are balanced)
    const tcpPercent = total > 0 ? (data.TCP / total) * 100 : 0;
    if (tcpPercent > 40 && tcpPercent < 80) score += 10;
    
    setHealthScore(Math.min(score, 100));
    
    // Set mood based on activity
    if (total === 0) setMood('sleeping');
    else if (total < 100) setMood('calm');
    else if (total < 1000) setMood('busy');
    else if (total < 10000) setMood('excited');
    else setMood('party');
    
    // Real-world comparisons
    if (total < 100) {
      setComparison('Like a quiet library 📚');
    } else if (total < 500) {
      setComparison('Like a coffee shop ☕');
    } else if (total < 2000) {
      setComparison('Like a busy street 🚗');
    } else if (total < 10000) {
      setComparison('Like a highway 🛣️');
    } else {
      setComparison('Like Times Square on New Year! 🎆');
    }
    
    // Level system
    const newLevel = Math.floor(total / 1000) + 1;
    setLevel(Math.min(newLevel, 100));
    
  }, [data, isConnected]);

  const getMoodEmoji = () => {
    const moods = {
      sleeping: '😴',
      calm: '😌',
      busy: '🤓',
      excited: '🤩',
      party: '🥳'
    };
    return moods[mood] || '😊';
  };

  const getMoodText = () => {
    const texts = {
      sleeping: 'Network is napping',
      calm: 'Smooth sailing',
      busy: 'Getting work done',
      excited: 'Traffic buzzing!',
      party: 'It\'s party time!'
    };
    return texts[mood] || 'All good';
  };

  const getHealthColor = () => {
    if (healthScore >= 80) return 'var(--success)';
    if (healthScore >= 60) return 'var(--accent)';
    if (healthScore >= 40) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="network-health-widget">
      <div className="health-main">
        <div className="health-score-circle">
          <svg viewBox="0 0 100 100" className="health-circle-svg">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(99, 102, 241, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getHealthColor()}
              strokeWidth="8"
              strokeDasharray={`${healthScore * 2.827} 282.7`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="health-circle-progress"
            />
          </svg>
          <div className="health-score-content">
            <div className="health-emoji">{getMoodEmoji()}</div>
            <div className="health-score-number">{healthScore}</div>
            <div className="health-score-label">Health</div>
          </div>
        </div>

        <div className="health-info">
          <div className="health-status">
            <h3>{getMoodText()}</h3>
            <p className="health-comparison">{comparison}</p>
          </div>

          <div className="health-level">
            <div className="level-badge">
              <span className="level-icon">⭐</span>
              <span className="level-text">Level {level}</span>
            </div>
            <div className="level-progress-bar">
              <div 
                className="level-progress-fill"
                style={{ width: `${(level % 1) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="health-stats-row">
        <div className="health-stat-item">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <div className="stat-value">
              {((data?.TCP || 0) + (data?.UDP || 0) + (data?.ICMP || 0)).toLocaleString()}
            </div>
            <div className="stat-label">Packets Delivered</div>
          </div>
        </div>

        <div className="health-stat-item">
          <span className="stat-icon">⚡</span>
          <div className="stat-content">
            <div className="stat-value">{mood === 'party' ? 'Max' : mood === 'excited' ? 'High' : mood === 'busy' ? 'Medium' : 'Low'}</div>
            <div className="stat-label">Activity Level</div>
          </div>
        </div>

        <div className="health-stat-item">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <div className="stat-value">{isConnected ? 'Online' : 'Offline'}</div>
            <div className="stat-label">Connection Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}