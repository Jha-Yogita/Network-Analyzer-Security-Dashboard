export default function StatsCards({ data, stats }) {
  const total = (data?.TCP || 0) + (data?.UDP || 0) + (data?.ICMP || 0);

  return (
    <div className="cards">
      <div className="card">
        <div className="card-icon">📊</div>
        <div className="card-content">
          <h3>Total Packets</h3>
          <p className="card-value">{total.toLocaleString()}</p>
          {stats && (
            <span className="card-subtitle">
              {stats.avg_packets_per_minute.toFixed(1)}/min avg
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-icon">🔵</div>
        <div className="card-content">
          <h3>TCP Traffic</h3>
          <p className="card-value">{(data?.TCP || 0).toLocaleString()}</p>
          <span className="card-subtitle">
            {total > 0 ? ((data.TCP / total) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-icon">🔴</div>
        <div className="card-content">
          <h3>UDP Traffic</h3>
          <p className="card-value">{(data?.UDP || 0).toLocaleString()}</p>
          <span className="card-subtitle">
            {total > 0 ? ((data.UDP / total) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-icon">🟡</div>
        <div className="card-content">
          <h3>ICMP Traffic</h3>
          <p className="card-value">{(data?.ICMP || 0).toLocaleString()}</p>
          <span className="card-subtitle">
            {total > 0 ? ((data.ICMP / total) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}