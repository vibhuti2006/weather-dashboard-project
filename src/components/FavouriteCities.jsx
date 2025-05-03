import React, { useContext, useState } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import './FavouriteCities.css';

const FavouriteCities = () => {
  const { favouriteCities, removeFavouriteCity, setSelectedCity, selectedCity } = useContext(WeatherContext);
  const [isAdding, setIsAdding] = useState(false);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const handleRemoveCity = (e, cityId) => {
    e.stopPropagation();
    removeFavouriteCity(cityId);
  };

  return (
    <div className="favourite-cities">
      <div className="favourite-cities-header">
        <h2 className="favourite-cities-title">Favourite Cities</h2>
      </div>

      {favouriteCities.length > 0 ? (
        <div className="favourite-cities-list">
          {favouriteCities.map((city) => (
            <div
              key={city.id}
              className="favourite-city"
              onClick={() => handleCityClick(city)}
              style={{
                backgroundColor: selectedCity?.id === city.id ? '#3c47e9' : '#100e1d',
              }}
            >
              <span className="favourite-city-name">{city.name}</span>
              <button
                className="favourite-city-remove"
                onClick={(e) => handleRemoveCity(e, city.id)}
                aria-label={`Remove ${city.name} from favourites`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favourites">
          No favourite cities yet. Search and add cities you want to track.
        </div>
      )}

      <button
        className="add-favourite"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        disabled={isAdding}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Search for cities
      </button>
    </div>
  );
};

export default FavouriteCities;