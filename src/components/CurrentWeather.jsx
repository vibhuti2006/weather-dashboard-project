import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import './CurrentWeather.css';

const CurrentWeather = () => {
  const { currentWeather, unit, isLoading, error } = useContext(WeatherContext);

  if (isLoading) {
    return (
      <div className="current-weather">
        <div className="weather-loading">
          <div className="weather-loading-spinner"></div>
          <div className="weather-loading-text">Loading current weather...</div>
        </div>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="current-weather">
        <div className="weather-error">
          <div className="weather-error-title">Unable to load weather data</div>
          <div className="weather-error-message">
            {error || "Weather data is not available. Please try again later."}
          </div>
        </div>
      </div>
    );
  }

  const {
    city,
    country,
    temperature,
    feelsLike,
    description,
    icon,
    humidity,
    windSpeed,
    pressure,
    visibility,
    dt,
  } = currentWeather;

  // Date formating from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Format temp acc to unit
  const formatTemp = (temp) => {
    return Math.round(temp);
  };

  // Format wind speed acc to unit
  const formatWindSpeed = (speed) => {
    return unit === 'metric' 
      ? `${speed.toFixed(1)} m/s` 
      : `${(speed * 2.237).toFixed(1)} mph`;
  };

  // Format visibility
  const formatVisibility = (vis) => {
    return unit === 'metric'
      ? `${(vis / 1000).toFixed(1)} km`
      : `${(vis / 1609.34).toFixed(1)} mi`;
  };

  return (
    <div className="current-weather">
      <div className="current-weather-header">
        <div className="current-weather-location">
          {city}, {country}
        </div>
        <div className="current-weather-date">{formatDate(dt)}</div>
      </div>

      <div className="current-weather-main">
        <div className="current-weather-temp">
          {formatTemp(temperature)}
          <span className="current-weather-unit">°{unit === 'metric' ? 'C' : 'F'}</span>
        </div>
        <img 
          className="current-weather-icon" 
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
          alt={description}
        />
      </div>

      <div className="current-weather-description">
        {description.charAt(0).toUpperCase() + description.slice(1)}
      </div>

      <div className="current-weather-details">
        <div className="weather-detail">
          <div className="weather-detail-label">Feels Like</div>
          <div className="weather-detail-value">
            {formatTemp(feelsLike)}°{unit === 'metric' ? 'C' : 'F'}
          </div>
        </div>

        <div className="weather-detail">
          <div className="weather-detail-label">Humidity</div>
          <div className="weather-detail-value">{humidity}%</div>
        </div>

        <div className="weather-detail">
          <div className="weather-detail-label">Wind</div>
          <div className="weather-detail-value">{formatWindSpeed(windSpeed)}</div>
        </div>

        <div className="weather-detail">
          <div className="weather-detail-label">Pressure</div>
          <div className="weather-detail-value">{pressure} hPa</div>
        </div>

        <div className="weather-detail">
          <div className="weather-detail-label">Visibility</div>
          <div className="weather-detail-value">{formatVisibility(visibility)}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;