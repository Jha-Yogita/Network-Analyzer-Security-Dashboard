import { useState, useEffect } from 'react';

export default function NetworkWeather({ data }) {
  const [weather, setWeather] = useState({
    condition: 'clear',
    icon: '☀️',
    description: 'Clear skies',
    temperature: '72°F'
  });

  useEffect(() => {
    const total = (data?.TCP || 0) + (data?.UDP || 0) + (data?.ICMP || 0);
    const tcpPercent = total > 0 ? (data.TCP / total) * 100 : 0;

    let newWeather = {};

    if (total === 0) {
      newWeather = {
        condition: 'calm',
        icon: '🌙',
        description: 'Calm night',
        temperature: '45°F',
        advice: 'Network is quiet and peaceful'
      };
    } else if (total < 100) {
      newWeather = {
        condition: 'clear',
        icon: '☀️',
        description: 'Clear skies',
        temperature: '72°F',
        advice: 'Perfect conditions for browsing'
      };
    } else if (total < 500) {
      newWeather = {
        condition: 'partly-cloudy',
        icon: '⛅',
        description: 'Partly cloudy',
        temperature: '68°F',
        advice: 'Light traffic moving smoothly'
      };
    } else if (total < 2000) {
      newWeather = {
        condition: 'cloudy',
        icon: '☁️',
        description: 'Cloudy',
        temperature: '65°F',
        advice: 'Moderate activity detected'
      };
    } else if (total < 5000) {
      newWeather = {
        condition: 'windy',
        icon: '💨',
        description: 'Windy',
        temperature: '62°F',
        advice: 'Lots of data flowing through!'
      };
    } else if (total < 10000) {
      newWeather = {
        condition: 'rainy',
        icon: '🌧️',
        description: 'Heavy traffic',
        temperature: '58°F',
        advice: 'Network is working hard'
      };
    } else {
      newWeather = {
        condition: 'stormy',
        icon: '⛈️',
        description: 'Data storm!',
        temperature: '55°F',
        advice: 'Maximum activity! Hold tight!'
      };
    }

    setWeather(newWeather);
  }, [data]);

  return (
    <div className="network-weather">
      <div className="weather-header">
        <h3>Network Weather</h3>
        <span className="weather-subtitle">Current conditions</span>
      </div>
      
      <div className="weather-display">
        <div className="weather-icon-large">{weather.icon}</div>
        <div className="weather-details">
          <div className="weather-condition">{weather.description}</div>
          <div className="weather-temp">{weather.temperature}</div>
          <div className="weather-advice">💡 {weather.advice}</div>
        </div>
      </div>

      <div className="weather-animation">
        {weather.condition === 'rainy' && (
          <div className="rain-effect">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }} />
            ))}
          </div>
        )}
        {weather.condition === 'stormy' && (
          <div className="storm-effect">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.3 + Math.random() * 0.3}s`
              }} />
            ))}
            <div className="lightning" />
          </div>
        )}
        {(weather.condition === 'clear' || weather.condition === 'partly-cloudy') && (
          <div className="sunshine-effect">
            <div className="sun-rays" />
          </div>
        )}
      </div>
    </div>
  );
}