import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import './WeatherCard.css';

const WeatherCard = ({ forecast }) => {
  const { unit } = useContext(WeatherContext);

  if (!forecast) {
    return null;
  }

  const {
    dt,
    temp,
    feels_like,
    humidity,
    wind_speed,
    pressure,
    weather,
  } = forecast;

  // formatting date from curr timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };


  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return 'Today';
    } else if (date.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    }
  };

  // format temp acc to unit
  const formatTemp = (temperature) => {
    return Math.round(temperature);
  };

  // format wind speed
  const formatWind = (speed) => {
    return unit === 'metric' 
      ? `${speed.toFixed(1)} m/s` 
      : `${(speed * 2.237).toFixed(1)} mph`;
  };

  return (
    <div className="weather-card">
      <div className="weather-card-day">{getDayName(dt)}</div>
      <div className="weather-card-date">{formatDate(dt)}</div>
      
      <img 
        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
        alt={weather[0].description}
        className="weather-card-icon"
      />
      
      <div className="weather-card-description">
        {weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}
      </div>
      
      <div className="weather-card-temps">
        <div className="weather-card-temp">
          <div className="weather-card-temp-label">High</div>
          <div className="weather-card-temp-max">
            {formatTemp(temp.max)}°{unit === 'metric' ? 'C' : 'F'}
          </div>
        </div>
        
        <div className="weather-card-temp">
          <div className="weather-card-temp-label">Low</div>
          <div className="weather-card-temp-min">
            {formatTemp(temp.min)}°{unit === 'metric' ? 'C' : 'F'}
          </div>
        </div>
      </div>
      
      <div className="weather-card-details">
        <div className="weather-card-detail">
          <div className="weather-card-detail-label">Feels Like</div>
          <div className="weather-card-detail-value">
            {formatTemp(feels_like.day)}°{unit === 'metric' ? 'C' : 'F'}
          </div>
        </div>
        
        <div className="weather-card-detail">
          <div className="weather-card-detail-label">Humidity</div>
          <div className="weather-card-detail-value">{humidity}%</div>
        </div>
        
        <div className="weather-card-detail">
          <div className="weather-card-detail-label">Wind</div>
          <div className="weather-card-detail-value">{formatWind(wind_speed)}</div>
        </div>
        
        <div className="weather-card-detail">
          <div className="weather-card-detail-label">Pressure</div>
          <div className="weather-card-detail-value">{pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;