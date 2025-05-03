import React, { useContext } from "react";
import { WeatherContext } from "./context/WeatherContext";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import FavouriteCities from "./components/FavouriteCities";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

function App() {
  const { forecast, unit, toggleUnit } = useContext(WeatherContext);


  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          Weatherly
        </div>

        <div className="unit-toggle">
          <button
            className={`unit-toggle-button ${
              unit === "metric" ? "active" : ""
            }`}
            onClick={toggleUnit}
            aria-label="Use Celsius"
          >
            °C
          </button>
          <button
            className={`unit-toggle-button ${
              unit === "imperial" ? "active" : ""
            }`}
            onClick={toggleUnit}
            aria-label="Use Fahrenheit"
          >
            °F
          </button>

        </div>
      </header>

      <SearchBar />

      <div className="main-content">
        <div className="sidebar">
          <CurrentWeather />
          <FavouriteCities />
        </div>

        <div className="forecast-section">
          <div className="forecast-header">
            <h2 className="forecast-title">5-Day Forecast</h2>
          </div>
          <div className="forecast-grid">
            {forecast?.map((day) => (
              <WeatherCard key={day.dt} forecast={day} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
