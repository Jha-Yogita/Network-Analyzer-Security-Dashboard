import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import socketService from '../services/socketService';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState(24);

  useEffect(() => {
    loadAlerts();

    const handleSecurityAlert = (alertData) => {
      setAlerts((prev) => [...alertData.alerts, ...prev]);
    };

    socketService.connect(() => {}, handleSecurityAlert, () => {});

    const interval = setInterval(loadAlerts, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAlerts = async () => {
    try {
      const response = await apiService.getAlerts(timeRange, false);
      setAlerts(response.data.alerts);
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await apiService.resolveAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const getSeverityClass = (severity) => {
    const classes = {
      critical: 'alert-critical',
      high: 'alert-high',
      medium: 'alert-medium',
      low: 'alert-low',
    };
    return classes[severity] || 'alert-low';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
    };
    return icons[severity] || '🔵';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🚨 Security Alerts</h1>
        <div className="alert-filters">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="time-select"
          >
            <option value={1}>Last Hour</option>
            <option value={6}>Last 6 Hours</option>
            <option value={24}>Last 24 Hours</option>
            <option value={168}>Last 7 Days</option>
          </select>
        </div>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({alerts.length})
        </button>
        <button
          className={filter === 'critical' ? 'active' : ''}
          onClick={() => setFilter('critical')}
        >
          Critical ({alerts.filter((a) => a.severity === 'critical').length})
        </button>
        <button
          className={filter === 'high' ? 'active' : ''}
          onClick={() => setFilter('high')}
        >
          High ({alerts.filter((a) => a.severity === 'high').length})
        </button>
        <button
          className={filter === 'medium' ? 'active' : ''}
          onClick={() => setFilter('medium')}
        >
          Medium ({alerts.filter((a) => a.severity === 'medium').length})
        </button>
        <button
          className={filter === 'low' ? 'active' : ''}
          onClick={() => setFilter('low')}
        >
          Low ({alerts.filter((a) => a.severity === 'low').length})
        </button>
      </div>

      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <p>✅ No alerts in the selected time range</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${getSeverityClass(alert.severity)}`}>
              <div className="alert-card-header">
                <div className="alert-icon">{getSeverityIcon(alert.severity)}</div>
                <div className="alert-info">
                  <h3>{alert.type.replace('_', ' ').toUpperCase()}</h3>
                  <p className="alert-time">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`severity-badge ${alert.severity}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="alert-card-body">
                <p className="alert-description">{alert.description}</p>
                {alert.source_ip && (
                  <p className="alert-source">
                    <strong>Source IP:</strong> {alert.source_ip}
                  </p>
                )}
              </div>
              <div className="alert-card-footer">
                <button
                  className="resolve-btn"
                  onClick={() => handleResolve(alert.id)}
                >
                  ✓ Resolve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}