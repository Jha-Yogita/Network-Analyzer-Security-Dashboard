import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import socketService from '../services/socketService';
import { apiService } from '../services/apiService';
import StatsCards from '../components/StatsCards';
import TopTalkers from '../components/TopTalkers';
import NetworkHealthScore from '../components/NetworkHealthScore';
import NetworkWeather from '../components/NetworkWeather';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [data, setData] = useState({ TCP: 0, UDP: 0, ICMP: 0 });
  const [currentData, setCurrentData] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handlePacketUpdate = (newData) => {
      setData(newData.protocols || { TCP: 0, UDP: 0, ICMP: 0 });
      setCurrentData(newData);
      setIsConnected(true);
    };

    const handleError = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socketService.connect(handlePacketUpdate, () => {}, handleError);

    loadHistoricalData();
    loadStats();

    const interval = setInterval(() => {
      loadStats();
      loadHistoricalData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadHistoricalData = async () => {
    try {
      const response = await apiService.getHistory(1, 30);
      setHistory(response.data.snapshots.reverse());
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getStats(24);
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      socketService.resumeCapture();
    } else {
      socketService.pauseCapture();
    }
    setIsPaused(!isPaused);
  };

  const pieChartData = {
    labels: ['TCP', 'UDP', 'ICMP'],
    datasets: [
      {
        label: 'Protocol Distribution',
        data: [data.TCP || 0, data.UDP || 0, data.ICMP || 0],
        backgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(245, 158, 11, 0.9)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const lineChartData = {
    labels: history.map((h) => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'TCP',
        data: history.map((h) => h.protocols.TCP),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'UDP',
        data: history.map((h) => h.protocols.UDP),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'ICMP',
        data: history.map((h) => h.protocols.ICMP),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: '600',
            family: "'DM Sans', sans-serif",
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 13,
            weight: '600',
            family: "'DM Sans', sans-serif",
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Traffic Over Last Hour',
        font: {
          size: 16,
          weight: '700',
          family: "'Outfit', sans-serif",
        },
        color: '#1e293b',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(99, 102, 241, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'DM Sans', sans-serif",
          },
          color: '#94a3b8',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(99, 102, 241, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'DM Sans', sans-serif",
          },
          color: '#94a3b8',
        },
      },
    },
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📡 Live Network Monitoring</h1>
        <div className="page-controls">
          <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Live' : '○ Offline'}
          </span>
          <button onClick={handlePauseResume} className="control-btn">
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <NetworkHealthScore data={data} stats={stats} isConnected={isConnected} />

      <StatsCards data={data} stats={stats} />

      <div className="charts-grid">
        <div className="chart-box">
          <h3>Current Protocol Distribution</h3>
          <div className="chart-container-pie">
            <Pie 
              data={pieChartData} 
              options={pieChartOptions}
            />
          </div>
        </div>

        <NetworkWeather data={data} />
      </div>

      <div className="chart-box chart-full">
        <div className="chart-container-line">
          <Line 
            data={lineChartData} 
            options={lineChartOptions}
          />
        </div>
      </div>

      <TopTalkers currentData={currentData} />
    </div>
  );
}