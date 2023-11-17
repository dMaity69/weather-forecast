function searchWeather() {
  const apiKey = '7d1f175294592e12adbba4f89cec20c9'; // Replace with your API key
  const city = document.getElementById('searchInput').value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const location = document.getElementById('location');
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      document.getElementById('date-time').innerText = `Date: ${currentDate}, Time: ${currentTime}`;
      const currentTemp = document.getElementById('currentTemp');
      const minMaxTemp = document.getElementById('minMaxTemp');
      const forecast = document.getElementById('forecast');

      if (data.cod === 200) {
        location.textContent = data.name + ', ' + data.sys.country;
        currentTemp.textContent = `Current Temperature: ${data.main.temp}°C`;
        minMaxTemp.textContent = `Max Temperature: ${data.main.temp_max}°C | Min Temperature: ${data.main.temp_min}°C`;

        const weatherCondition = data.weather[0].main.toLowerCase();
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weatherCondition}')`; // Using Unsplash for random weather images

        // Example of displaying future weather details (next 3 days)
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        fetch(forecastUrl)
          .then(response => response.json())
          .then(forecastData => {
            const forecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
            forecast.innerHTML = '';
            forecasts.slice(0, 3).forEach(forecastItem => {
              const date = new Date(forecastItem.dt * 1000);
              const day = date.toLocaleDateString('en-US', { weekday: 'long' });
              const temp = forecastItem.main.temp;
              const description = forecastItem.weather[0].description;
              const icon = forecastItem.weather[0].icon;

              const forecastCard = `
                <div class="forecast-card">
                  <p>${day}</p>
                  <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                  <p>${temp}°C</p>
                </div>
              `;
              forecast.innerHTML += forecastCard;
            });
          })
          .catch(error => console.error('Error fetching forecast data:', error));
      } else {
        location.textContent = 'City not found';
        currentTemp.textContent = '';
        minMaxTemp.textContent = '';
        forecast.textContent = '';
        document.body.style.backgroundImage = '';
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}
function getWeatherByCoordinates(latitude, longitude) {
  const apiKey = '7d1f175294592e12adbba4f89cec20c9'; // Replace with your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displayWeatherData(data) {
  const location = document.getElementById('location');
  const currentTemp = document.getElementById('currentTemp');
  const minMaxTemp = document.getElementById('minMaxTemp');
  const forecast = document.getElementById('forecast');

  if (data.cod === 200) {
    location.textContent = data.name + ', ' + data.sys.country;
    currentTemp.textContent = `Current Temperature: ${data.main.temp}°C`;
    minMaxTemp.textContent = `Max Temperature: ${data.main.temp_max}°C | Min Temperature: ${data.main.temp_min}°C`;

    // Set background image based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weatherCondition}')`;

    // Fetch and display future weather details (next 3 days)
    // (similar to previous code for future forecasts)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
          .then(response => response.json())
          .then(forecastData => {
            const forecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
            forecast.innerHTML = '';
            forecasts.slice(0, 3).forEach(forecastItem => {
              const date = new Date(forecastItem.dt * 1000);
              const day = date.toLocaleDateString('en-US', { weekday: 'long' });
              const temp = forecastItem.main.temp;
              const description = forecastItem.weather[0].description;
              const icon = forecastItem.weather[0].icon;

              const forecastCard = `
                <div class="forecast-card">
                  <p>${day}</p>
                  <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                  <p>${temp}°C</p>
                </div>
              `;
              forecast.innerHTML += forecastCard;
            });
          })
          .catch(error => console.error('Error fetching forecast data:', error));
  } else {
    location.textContent = 'Weather data not available';
    currentTemp.textContent = '';
    minMaxTemp.textContent = '';
    forecast.textContent = '';
    document.body.style.backgroundImage = '';
  }
}

function getDefaultLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeatherByCoordinates(latitude, longitude);
    }, error => {
      console.error('Error getting user location:', error);
      // You can provide a default location as a fallback in case geolocation fails
      getWeatherByCoordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Replace with default coordinates
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
    // You can provide a default location as a fallback if geolocation is not supported
    getWeatherByCoordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Replace with default coordinates
  }
}

// Call the function to load weather for the default location on page load
getDefaultLocationWeather();


  // Function to handle search on Enter key press
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      searchWeather();
    }
  }
  
  // Adding event listener to the input field
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keypress', handleKeyPress);