import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// WeatherMap Component using custom CSS map
const WeatherMap = ({ lat, lon, isDark, weatherData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !lat || !lon) return;

    // Clear any existing content
    mapRef.current.innerHTML = '';

    // Create a simple map representation using CSS and HTML
    const mapContainer = document.createElement('div');
    mapContainer.className = `relative w-full h-64 rounded-lg overflow-hidden ${
      isDark ? 'bg-gray-800' : 'bg-blue-100'
    }`;
    
    // Create map background with gradient
    mapContainer.style.background = isDark 
      ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
      : 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)';

    // Add location marker
    const marker = document.createElement('div');
    marker.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    marker.innerHTML = `
      <div class="relative">
        <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <span class="text-white text-sm">📍</span>
        </div>
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
          <div class="text-center">
            <div class="font-semibold">${weatherData?.name || 'Current Location'}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">${lat.toFixed(2)}°, ${lon.toFixed(2)}°</div>
          </div>
        </div>
      </div>
    `;

    // Add weather overlay
    const weatherOverlay = document.createElement('div');
    weatherOverlay.className = 'absolute inset-0 pointer-events-none';
    
    // Add animated weather effect based on current weather
    if (weatherData?.weather?.[0]?.main) {
      const weatherMain = weatherData.weather[0].main.toLowerCase();
      let weatherEffect = '';
      
      if (weatherMain.includes('rain')) {
        weatherEffect = `
          <div class="absolute inset-0 opacity-30">
            ${Array.from({length: 20}, (_, i) => `
              <div class="absolute w-px h-8 bg-blue-400 animate-pulse" 
                   style="left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; 
                          animation-delay: ${Math.random() * 2}s; 
                          animation-duration: ${1 + Math.random()}s;">
              </div>
            `).join('')}
          </div>
        `;
      } else if (weatherMain.includes('cloud')) {
        weatherEffect = `
          <div class="absolute inset-0 opacity-20">
            ${Array.from({length: 5}, (_, i) => `
              <div class="absolute w-16 h-8 bg-white dark:bg-gray-600 rounded-full animate-float" 
                   style="left: ${Math.random() * 80}%; top: ${Math.random() * 70}%; 
                          animation-delay: ${Math.random() * 3}s;">
              </div>
            `).join('')}
          </div>
        `;
      }
      
      weatherOverlay.innerHTML = weatherEffect;
    }

    // Add coordinate grid
    const grid = document.createElement('div');
    grid.className = 'absolute inset-0 opacity-10';
    grid.innerHTML = `
      <svg class="w-full h-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `;

    mapContainer.appendChild(grid);
    mapContainer.appendChild(weatherOverlay);
    mapContainer.appendChild(marker);
    mapRef.current.appendChild(mapContainer);

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [lat, lon, isDark, weatherData]);

  return <div ref={mapRef} className="w-full h-64" />;
};

// Weather Component
const Weather = () => {
  const { isDark } = useTheme();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [weatherSources, setWeatherSources] = useState({
    openweather: null,
    weatherapi: null,
    accuweather: null
  });
  const [activeSource, setActiveSource] = useState('openweather');

  // API Keys for multiple weather services
  const OPENWEATHER_API_KEY = '2a496ed70c4234605ff47cea15a3bd6a';
  const WEATHERAPI_KEY = 'your_weatherapi_key_here'; // Replace with actual key
  const ACCUWEATHER_API_KEY = 'your_accuweather_key_here'; // Replace with actual key

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Location access denied. Using default location (Delhi).');
          // Default to Delhi, India
          setCoords({ lat: 28.6139, lon: 77.2090 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Using Delhi as default.');
      setCoords({ lat: 28.6139, lon: 77.2090 });
    }
  }, []);

  // Fetch weather data from OpenWeatherMap API
  const fetchOpenWeatherData = async () => {
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!currentWeatherResponse.ok) {
        throw new Error('OpenWeatherMap API failed');
      }
      
      const currentWeatherData = await currentWeatherResponse.json();
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('OpenWeatherMap forecast failed');
      }
      
      const forecastData = await forecastResponse.json();
      
      return {
        current: currentWeatherData,
        forecast: forecastData,
        source: 'OpenWeatherMap'
      };
    } catch (error) {
      console.error('OpenWeatherMap Error:', error);
      return null;
    }
  };

  // Fetch weather data from WeatherAPI
  const fetchWeatherAPIData = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${coords.lat},${coords.lon}&days=5&aqi=yes&alerts=yes`
      );
      
      if (!response.ok) {
        throw new Error('WeatherAPI failed');
      }
      
      const data = await response.json();
      
      return {
        current: data.current,
        forecast: data.forecast,
        location: data.location,
        source: 'WeatherAPI'
      };
    } catch (error) {
      console.error('WeatherAPI Error:', error);
      return null;
    }
  };

  // Fetch weather data from AccuWeather (simplified)
  const fetchAccuWeatherData = async () => {
    try {
      // First get location key
      const locationResponse = await fetch(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ACCUWEATHER_API_KEY}&q=${coords.lat},${coords.lon}`
      );
      
      if (!locationResponse.ok) {
        throw new Error('AccuWeather location failed');
      }
      
      const locationData = await locationResponse.json();
      const locationKey = locationData.Key;
      
      // Get current conditions
      const currentResponse = await fetch(
        `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('AccuWeather current failed');
      }
      
      const currentData = await currentResponse.json();
      
      // Get 5-day forecast
      const forecastResponse = await fetch(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&metric=true`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('AccuWeather forecast failed');
      }
      
      const forecastData = await forecastResponse.json();
      
      return {
        current: currentData[0],
        forecast: forecastData,
        location: locationData,
        source: 'AccuWeather'
      };
    } catch (error) {
      console.error('AccuWeather Error:', error);
      return null;
    }
  };

  // Fetch weather data from all sources
  useEffect(() => {
    if (!coords.lat || !coords.lon) return;

    const fetchAllWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from all sources in parallel
        const [openWeatherData, weatherAPIData, accuWeatherData] = await Promise.allSettled([
          fetchOpenWeatherData(),
          fetchWeatherAPIData(),
          fetchAccuWeatherData()
        ]);
        
        const sources = {
          openweather: openWeatherData.status === 'fulfilled' ? openWeatherData.value : null,
          weatherapi: weatherAPIData.status === 'fulfilled' ? weatherAPIData.value : null,
          accuweather: accuWeatherData.status === 'fulfilled' ? accuWeatherData.value : null
        };
        
        setWeatherSources(sources);
        
        // Set primary data from the first available source
        const primaryData = sources.openweather || sources.weatherapi || sources.accuweather;
        
        if (primaryData) {
          setWeather(primaryData.current);
          setForecast(primaryData.forecast);
          setLocation(primaryData.location?.name || primaryData.current?.name || 'Unknown Location');
        } else {
          setError('All weather services are currently unavailable. Please try again later.');
        }
        
        setLoading(false);
        
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to fetch weather data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllWeatherData();
  }, [coords]);

  // Map OpenWeatherMap icon codes to emojis
  const mapWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    
    return iconMap[iconCode] || '🌤️';
  };

  // Prepare hourly forecast data for chart
  const prepareChartData = () => {
    if (!forecast) return { labels: [], datasets: [] };
    
    const hourlyData = forecast.list.slice(0, 8); // Next 24 hours (3-hour intervals)
    
    return {
      labels: hourlyData.map(item => {
        const date = new Date(item.dt * 1000);
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric',
          hour12: true 
        });
      }),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: hourlyData.map(item => Math.round(item.main.temp)),
          borderColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
          pointBorderColor: isDark ? 'rgb(147, 197, 253)' : 'rgb(59, 130, 246)',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#e5e7eb' : '#374151',
          font: { size: 14 }
        }
      },
      title: {
        display: true,
        text: '24-Hour Temperature Forecast',
        color: isDark ? '#e5e7eb' : '#374151',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#e5e7eb' : '#374151',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)',
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#374151',
          callback: function(value) {
            return value + '°C';
          }
        }
      },
      x: {
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)',
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#374151',
        }
      },
    },
  };

  // Prepare 5-day forecast
  const prepareFiveDayForecast = () => {
    if (!forecast) return [];
    
    const dailyData = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          temps: [],
          conditions: [],
          icons: [],
          humidity: [],
          precipitation: 0
        };
      }
      
      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].conditions.push(item.weather[0].description);
      dailyData[dateKey].icons.push(item.weather[0].icon);
      dailyData[dateKey].humidity.push(item.main.humidity);
      
      if (item.rain && item.rain['3h']) {
        dailyData[dateKey].precipitation += item.rain['3h'];
      }
    });
    
    return Object.values(dailyData).slice(0, 5).map((day, index) => {
      const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
      const maxTemp = Math.max(...day.temps);
      const minTemp = Math.min(...day.temps);
      const mostCommonIcon = day.icons[0]; // Simplified - use first icon
      
      return {
        day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(maxTemp),
        low: Math.round(minTemp),
        condition: day.conditions[0],
        icon: mostCommonIcon,
        precipitation: Math.round(day.precipitation * 10) // Convert to percentage-like value
      };
    });
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return 'text-red-600 dark:text-red-400';
    if (temp >= 30) return 'text-orange-600 dark:text-orange-400';
    if (temp >= 25) return 'text-yellow-600 dark:text-yellow-400';
    if (temp >= 20) return 'text-green-600 dark:text-green-400';
    if (temp >= 15) return 'text-blue-600 dark:text-blue-400';
    return 'text-blue-800 dark:text-blue-300';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🌤️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Loading Weather Data</h2>
          <p className="text-gray-600 dark:text-gray-400">Getting your location and fetching current conditions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md mx-4 border border-red-200 dark:border-red-800">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Weather Data Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              window.location.reload();
            }}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();
  const fiveDayForecast = prepareFiveDayForecast();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                🌤️ Weather Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                📍 {location}
              </p>
            </div>
          </div>
          
          {/* Weather Source Selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Sources:</span>
            {Object.entries(weatherSources).map(([key, data]) => (
              <button
                key={key}
                onClick={() => {
                  if (data) {
                    setActiveSource(key);
                    setWeather(data.current);
                    setForecast(data.forecast);
                    setLocation(data.location?.name || data.current?.name || 'Unknown Location');
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  data 
                    ? activeSource === key
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed'
                }`}
                disabled={!data}
              >
                {key === 'openweather' && '🌤️ OpenWeather'}
                {key === 'weatherapi' && '🌦️ WeatherAPI'}
                {key === 'accuweather' && '🌡️ AccuWeather'}
                {!data && ' ❌'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Weather */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <span className="mr-3">🌡️</span>
                  Current Weather
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Updated {new Date().toLocaleTimeString()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-pulse">
                    {weather && mapWeatherIcon(weather.weather[0].icon)}
                  </div>
                  <div className={`text-6xl font-bold mb-4 ${weather && getTemperatureColor(weather.main.temp)}`}>
                    {weather && Math.round(weather.main.temp)}°C
                  </div>
                  <div className="text-2xl text-gray-600 dark:text-gray-300 mb-2 capitalize">
                    {weather && weather.weather[0].description}
                  </div>
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    Feels like {weather && Math.round(weather.main.feels_like)}°C
                  </div>
                </div>
                
                <div className="space-y-4">
                  {weather && [
                    { label: 'Humidity', value: `${weather.main.humidity}%`, icon: '💧', color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Wind Speed', value: `${Math.round(weather.wind.speed * 3.6)} km/h`, icon: '💨', color: 'text-green-600 dark:text-green-400' },
                    { label: 'Pressure', value: `${weather.main.pressure} hPa`, icon: '📊', color: 'text-purple-600 dark:text-purple-400' },
                    { label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km`, icon: '👁️', color: 'text-orange-600 dark:text-orange-400' },
                    { label: 'Sunrise', value: formatTime(weather.sys.sunrise), icon: '🌅', color: 'text-yellow-600 dark:text-yellow-400' },
                    { label: 'Sunset', value: formatTime(weather.sys.sunset), icon: '🌇', color: 'text-red-600 dark:text-red-400' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                      </div>
                      <span className={`font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Temperature Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <span className="mr-3">📈</span>
                Temperature Forecast
              </h2>
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <span className="mr-3">📅</span>
                5-Day Forecast
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {fiveDayForecast.map((day, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {day.day}
                    </div>
                    <div className="text-4xl mb-3">{mapWeatherIcon(day.icon)}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-3 capitalize">
                      {day.condition}
                    </div>
                    <div className="text-center mb-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rain</div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        💧 {day.precipitation}%
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      <span className={getTemperatureColor(day.high)}>{day.high}°</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-600 dark:text-gray-300">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weather Map */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="mr-2">🗺️</span>
                Location Map
              </h3>
              <WeatherMap lat={coords.lat} lon={coords.lon} isDark={isDark} weatherData={weather} />
            </div>

            {/* Data Source Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Data Comparison
              </h3>
              <div className="space-y-3">
                {Object.entries(weatherSources).map(([key, data]) => {
                  if (!data) return null;
                  
                  const temp = data.current?.main?.temp || data.current?.temp_c || data.current?.Temperature?.Metric?.Value;
                  const humidity = data.current?.main?.humidity || data.current?.humidity || data.current?.RelativeHumidity;
                  const windSpeed = data.current?.wind?.speed || data.current?.wind_kph || data.current?.Wind?.Speed?.Metric?.Value;
                  
                  return (
                    <div key={key} className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      activeSource === key 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          {key === 'openweather' && '🌤️ OpenWeather'}
                          {key === 'weatherapi' && '🌦️ WeatherAPI'}
                          {key === 'accuweather' && '🌡️ AccuWeather'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activeSource === key ? 'Active' : 'Available'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {temp ? Math.round(temp) : 'N/A'}°C
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">Temp</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {humidity || 'N/A'}%
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">Humidity</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {windSpeed ? Math.round(windSpeed) : 'N/A'} km/h
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">Wind</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Quick Stats
              </h3>
              {weather && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">🌡️ Temperature Range</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {Math.round(weather.main.temp_min)}° - {Math.round(weather.main.temp_max)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">🌬️ Wind Direction</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {weather.wind.deg}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">☁️ Cloudiness</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {weather.clouds.all}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Weather Alerts */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">⚠️</span>
                Weather Tips
              </h3>
              <div className="space-y-3">
                {weather && [
                  {
                    condition: weather.main.temp > 35,
                    icon: '🌡️',
                    tip: 'Extreme heat! Stay hydrated and avoid outdoor activities.'
                  },
                  {
                    condition: weather.main.humidity > 80,
                    icon: '💧',
                    tip: 'High humidity levels. Expect muggy conditions.'
                  },
                  {
                    condition: weather.wind.speed > 10,
                    icon: '💨',
                    tip: 'Strong winds expected. Secure loose objects.'
                  },
                  {
                    condition: weather.weather[0].main.toLowerCase().includes('rain'),
                    icon: '☂️',
                    tip: 'Rain expected. Carry an umbrella and drive carefully.'
                  },
                  {
                    condition: weather.visibility < 5000,
                    icon: '🌫️',
                    tip: 'Low visibility due to fog/haze. Drive with caution.'
                  }
                ].filter(alert => alert.condition).slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/20 rounded-xl">
                    <span className="text-xl">{alert.icon}</span>
                    <p className="text-sm font-medium">{alert.tip}</p>
                  </div>
                ))}
                
                {(!weather || 
                  !(weather.main.temp > 35 || 
                    weather.main.humidity > 80 || 
                    weather.wind.speed > 10 || 
                    weather.weather[0].main.toLowerCase().includes('rain') || 
                    weather.visibility < 5000)) && (
                  <div className="flex items-start space-x-3 p-3 bg-white/20 rounded-xl">
                    <span className="text-xl">✅</span>
                    <p className="text-sm font-medium">Good weather conditions! Perfect for outdoor activities.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">🚨</span>
                Emergency Contacts
              </h3>
              <div className="space-y-3">
                {[
                  { service: 'Disaster Management', number: '108', icon: '🌪️' },
                  { service: 'Police Emergency', number: '100', icon: '👮' },
                  { service: 'Fire Department', number: '101', icon: '🚒' },
                  { service: 'Medical Emergency', number: '102', icon: '🚑' }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{contact.icon}</span>
                      <span className="font-medium">{contact.service}</span>
                    </div>
                    <a 
                      href={`tel:${contact.number}`}
                      className="text-xl font-bold hover:text-yellow-200 transition-colors"
                    >
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔄</span>
                  <span>Refresh Weather Data</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(2deg); 
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .theme-transition {
          transition: all 0.3s ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-pulse,
          .animate-spin {
            animation: none;
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        
        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Weather;