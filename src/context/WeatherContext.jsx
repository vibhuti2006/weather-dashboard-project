import React, { createContext, useState, useEffect } from "react";
import "./WeatherContext.css";

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [unit, setUnit] = useState(() => {
    const savedUnit = localStorage.getItem("weatherUnit");
    return savedUnit || "metric";
  });

  const [selectedCity, setSelectedCity] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [favouriteCities, setFavouriteCities] = useState(() => {
    const saved = localStorage.getItem("favouriteCities");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Error parsing saved favourite cities", err);
        return [];
      }
    }
    return [];
  });


  useEffect(() => {
    if (!selectedCity && favouriteCities.length > 0) {
      setSelectedCity(favouriteCities[0]);
    } else if (!selectedCity) {

      setSelectedCity({
        id: "6695236",
        name: "Bengaluru",
        country: "IN",
        lat: 12.9768,
        lon: 77.5901,
      });

    }
  }, [favouriteCities]);

  // favourite cities in localStorage
  useEffect(() => {
    localStorage.setItem("favouriteCities", JSON.stringify(favouriteCities));
  }, [favouriteCities]);


  useEffect(() => {
    localStorage.setItem("weatherUnit", unit);
  }, [unit]);

  // fetching weather data 
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedCity) return;

      setIsLoading(true);
      setError(null);

      try {

        const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

        // Current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=${unit}`
        );
        // console.log(currentResponse.ok);

        if (!currentResponse.ok) {
          throw new Error("Failed to fetch current weather");
        }

        const currentData = await currentResponse.json();
        console.log(currentData);
        // console.log(selectedCity);
        
        await new Promise((resolve) => setTimeout(resolve, 1000));


        setCurrentWeather({
            city: currentData.name === "Kanija Bhavan" ? "Bengaluru" : currentData.name,
            country: selectedCity.country,
            temperature: currentData.main.temp,
            feelsLike: currentData.main.feels_like,
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
            humidity: currentData.main.humidity,
            windSpeed: currentData.wind.speed,
            pressure: currentData.main.pressure,
            visibility: currentData.visibility,
            dt: currentData.dt,
        });
        console.log(currentData.name);

        // Forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=${unit}`
        );
        // console.log(forecastResponse);

        if (!forecastResponse) {
          throw new Error("Failed to fetch forecast data");
        }

        const forecastData = await forecastResponse.json();
        console.log(forecastData);
        console.log(forecastData.list[0].dt);



        const dailyData = {};

        forecastData.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0]; 
          if (!dailyData[date]) {
            dailyData[date] = [];
          }
          dailyData[date].push(item);
        });


        const summarizedForecast = Object.keys(dailyData)
          .slice(0, 5)
          .map((date) => {
            const entries = dailyData[date];
            const temps = entries.map((e) => e.main.temp);
            const minTemp = Math.min(...temps);
            const maxTemp = Math.max(...temps);
            const midday =
              entries.find((e) => e.dt_txt.includes("12:00:00")) || entries[0];

            return {
              dt: new Date(date).getTime() / 1000,
              temp: { min: minTemp, max: maxTemp },
              feels_like: { day: midday.main.feels_like },
              humidity: midday.main.humidity,
              wind_speed: midday.wind.speed,
              pressure: midday.main.pressure,
              weather: midday.weather,
            };
          });

        setForecast(summarizedForecast);


        // setForecast(forecastData.list[0].dt);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError(err.message || "Failed to fetch weather data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCity, unit]);

  // toggle temp unit
  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  // city to favourites
  const addFavouriteCity = (city) => {
    setFavouriteCities((prev) => {

      if (prev.some((c) => c.id === city.id)) {
        return prev;
      }
      return [...prev, city];
    });
  };

  // remove city from favourites
  const removeFavouriteCity = (cityId) => {
    setFavouriteCities((prev) => prev.filter((city) => city.id !== cityId));


    if (selectedCity && selectedCity.id === cityId) {
      if (favouriteCities.length > 1) {

        const nextCity = favouriteCities.find((city) => city.id !== cityId);
        setSelectedCity(nextCity);
      } else {
        setSelectedCity(null);
      }
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        toggleUnit,
        selectedCity,
        setSelectedCity,
        currentWeather,
        forecast,
        isLoading,
        error,
        favouriteCities,
        addFavouriteCity,
        removeFavouriteCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherProvider;
