import { useState, useEffect } from 'react';

export default function TopTalkers({ currentData }) {
  const [topSources, setTopSources] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);

  useEffect(() => {
    if (currentData?.top_source_ips) {
      setTopSources(currentData.top_source_ips.slice(0, 5));
    }
    if (currentData?.top_destination_ips) {
      setTopDestinations(currentData.top_destination_ips.slice(0, 5));
    }
  }, [currentData]);

  return (
    <div className="top-talkers-grid">
      <div className="top-talkers-box">
        <h3>🔼 Top Source IPs</h3>
        <div className="talkers-list">
          {topSources.length > 0 ? (
            topSources.map(([ip, count], index) => (
              <div key={ip} className="talker-item">
                <span className="talker-rank">#{index + 1}</span>
                <span className="talker-ip">{ip}</span>
                <span className="talker-count">{count.toLocaleString()} packets</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
      </div>

      <div className="top-talkers-box">
        <h3>🔽 Top Destination IPs</h3>
        <div className="talkers-list">
          {topDestinations.length > 0 ? (
            topDestinations.map(([ip, count], index) => (
              <div key={ip} className="talker-item">
                <span className="talker-rank">#{index + 1}</span>
                <span className="talker-ip">{ip}</span>
                <span className="talker-count">{count.toLocaleString()} packets</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}