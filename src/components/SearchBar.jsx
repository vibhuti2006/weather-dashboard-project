import React, { useState, useEffect, useContext, useRef } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  const { addFavouriteCity, setSelectedCity, favouriteCities } = useContext(WeatherContext);

  useEffect(() => {
    // close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchCities = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      setError('');
      setShowResults(true);

      try {
        // const apiKey = process.env.OPEN_WEATHER_API_KEY;
        const apiKey = 'b32abc4a9571774e222698dac231512d';


        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await response.json();
        
        // formatting the data to include id and check if already in favorites
        const formattedData = data.map(city => ({
          id: `${city.lat}_${city.lon}`,
          name: city.name,
          country: city.country,
          state: city.state,
          lat: city.lat,
          lon: city.lon,
          isFavourite: favouriteCities.some(fav => 
            fav.lat === city.lat && fav.lon === city.lon
          )
        }));

        setResults(formattedData);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    // debounce search to optimze
    const timeoutId = setTimeout(searchCities, 500);
    return () => clearTimeout(timeoutId);
  }, [query, favouriteCities]);

  const handleSearch = (e) => {
    e.preventDefault();

  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setShowResults(false);
    setQuery('');
  };

  const handleAddToFavourites = (e, city) => {
    e.stopPropagation();
    addFavouriteCity(city);
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search for a city"
        />
        <button type="submit" className="search-button" aria-label="Search">
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {showResults && (
        <div className="search-results">
          {isLoading && (
            <div className="loading-indicator">
              <div className="weather-loading-spinner"></div>
              <div>Searching...</div>
            </div>
          )}

          {!isLoading && error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && query.trim().length >= 2 && (
            <div className="no-results">
              No cities found. Try a different search term.
            </div>
          )}

          {!isLoading && 
            !error && 
            results.map((city) => (
              <div
                key={city.id}
                className="search-result-item"
                onClick={() => handleSelectCity(city)}
              >
                <div className="search-result-name">
                  <span className="search-result-city">{city.name}</span>
                  <span className="search-result-country">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </span>
                </div>
                {!city.isFavourite && (
                  <button
                    className="search-result-add"
                    onClick={(e) => handleAddToFavourites(e, city)}
                    aria-label={`Add ${city.name} to favourites`}
                  >
                    Add
                  </button>
                )}
                {city.isFavourite && (
                  <span className="search-result-added">Added</span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;