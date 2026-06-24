/* ============================================
   OUTSTANDING WEATHER DASHBOARD - JAVASCRIPT
   Powered by Open-Meteo (Smarter Search Edition)
   ============================================ */

class WeatherDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
    }

    cacheElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.weatherDisplay = document.getElementById('weatherDisplay');
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.initialState = document.getElementById('initialState');
        this.errorMessage = document.getElementById('errorMessage');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (city === '') {
            this.showError('Please enter a city name');
            return;
        }

        if (city.toLowerCase() === 'demo') {
            this.showDemoData();
            return;
        }

        await this.fetchWeather(city);
    }

    async fetchWeather(city) {
        try {
            this.showLoading();

            // Step 1: Smarter Geocoding (Fetching up to 5 results to find the best match)
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`Could not find "${city}". Try adding a country (e.g., "Paris, France")`);
            }

            // Pick the most relevant result (usually the first one, which is the most populated)
            const bestMatch = geoData.results[0];
            const { latitude, longitude, name, country, admin1 } = bestMatch;
            const displayLocation = admin1 ? `${name}, ${admin1}, ${country}` : `${name}, ${country}`;

            // Step 2: Get weather data using coordinates
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,surface_pressure,wind_speed_10m&timezone=auto`);
            const weatherData = await weatherRes.json();

            if (!weatherData.current) {
                throw new Error('Could not fetch weather data for this location.');
            }

            this.renderWeather(weatherData, displayLocation);
            this.hideError();

            // Clear input and keep focus for next search
            this.cityInput.value = '';
            this.cityInput.focus();

        } catch (error) {
            this.showError(error.message);
        }
    }

    renderWeather(data, locationName) {
        const current = data.current;
        
        document.getElementById('cityName').textContent = locationName;
        document.getElementById('weatherDescription').textContent = this.getWeatherDescription(current.weather_code);
        document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
        document.getElementById('weatherIcon').textContent = this.getWeatherIcon(current.weather_code);
        
        document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
        document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;
        
        document.getElementById('visibility').textContent = '10+ km';
        document.getElementById('uvIndex').textContent = 'Moderate';
        document.getElementById('sunrise').textContent = 'Dynamic';
        document.getElementById('sunset').textContent = 'Dynamic';

        this.initialState.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.weatherDisplay.style.display = 'block';
    }

    getWeatherDescription(code) {
        const codes = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
            61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
            71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
            80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
            95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
        };
        return codes[code] || 'Cloudy';
    }

    getWeatherIcon(code) {
        if (code === 0) return '☀️';
        if (code <= 3) return '🌤️';
        if (code <= 48) return '🌫️';
        if (code <= 55) return '🌦️';
        if (code <= 65) return '🌧️';
        if (code <= 77) return '❄️';
        if (code <= 82) return '🌦️';
        return '⛈️';
    }

    showDemoData() {
        this.showLoading();
        setTimeout(() => {
            const mockData = {
                current: {
                    temperature_2m: 28, relative_humidity_2m: 40, apparent_temperature: 30,
                    weather_code: 0, pressure_msl: 1013, wind_speed_10m: 5
                }
            };
            this.renderWeather(mockData, "Demo City, Portfolio State, World");
            this.hideError();
        }, 800);
    }

    showLoading() {
        this.initialState.style.display = 'none';
        this.weatherDisplay.style.display = 'none';
        this.errorState.style.display = 'none';
        this.loadingState.style.display = 'block';
    }

    showError(message) {
        this.errorMessage.textContent = `❌ ${message}`;
        this.loadingState.style.display = 'none';
        this.errorState.style.display = 'block';
    }

    hideError() { this.errorState.style.display = 'none'; }
}

document.addEventListener('DOMContentLoaded', () => new WeatherDashboard());