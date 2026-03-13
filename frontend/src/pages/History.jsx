import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { apiService } from '../services/apiService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function History() {
  const [timeRange, setTimeRange] = useState(24);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [timeRange]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await apiService.getHistory(timeRange, 200);
      setHistory(response.data.snapshots.reverse());
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: history.map((h) => {
      const date = new Date(h.timestamp);
      return timeRange > 24
        ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        : date.toLocaleTimeString();
    }),
    datasets: [
      {
        label: 'TCP',
        data: history.map((h) => h.protocols.TCP),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 5,
      },
      {
        label: 'UDP',
        data: history.map((h) => h.protocols.UDP),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 5,
      },
      {
        label: 'ICMP',
        data: history.map((h) => h.protocols.ICMP),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 5,
      },
    ],
  };

  const barChartData = {
    labels: history.map((h) => {
      const date = new Date(h.timestamp);
      return date.toLocaleTimeString();
    }),
    datasets: [
      {
        label: 'Total Packets',
        data: history.map((h) => h.total_packets),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(139, 92, 246, 1)',
      },
    ],
  };

  const chartOptions = {
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
          maxRotation: 45,
          minRotation: 0,
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
        <h1>📊 Historical Analysis</h1>
        <div className="time-range-selector">
          <button
            className={timeRange === 1 ? 'active' : ''}
            onClick={() => setTimeRange(1)}
          >
            1 Hour
          </button>
          <button
            className={timeRange === 6 ? 'active' : ''}
            onClick={() => setTimeRange(6)}
          >
            6 Hours
          </button>
          <button
            className={timeRange === 24 ? 'active' : ''}
            onClick={() => setTimeRange(24)}
          >
            24 Hours
          </button>
          <button
            className={timeRange === 168 ? 'active' : ''}
            onClick={() => setTimeRange(168)}
          >
            7 Days
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="chart-box chart-full">
            <h3>Protocol Traffic Trends</h3>
            <div className="chart-container-large">
              <Line 
                key={`line-${timeRange}`}
                data={lineChartData} 
                options={chartOptions}
              />
            </div>
          </div>

          <div className="chart-box chart-full">
            <h3>Total Packet Volume</h3>
            <div className="chart-container-large">
              <Bar 
                key={`bar-${timeRange}`}
                data={barChartData} 
                options={chartOptions}
              />
            </div>
          </div>

          <div className="data-table">
            <h3>Recent Snapshots</h3>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>TCP</th>
                  <th>UDP</th>
                  <th>ICMP</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 20).map((snapshot) => (
                  <tr key={snapshot.id}>
                    <td>{new Date(snapshot.timestamp).toLocaleString()}</td>
                    <td>{snapshot.protocols.TCP.toLocaleString()}</td>
                    <td>{snapshot.protocols.UDP.toLocaleString()}</td>
                    <td>{snapshot.protocols.ICMP.toLocaleString()}</td>
                    <td>{snapshot.total_packets.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}