const container = document.querySelector('.app-container');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.querySelector('.weather-display');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature-value');
const description = document.getElementById('description-text');
const humidityValue = document.getElementById('humidity-value');
const windSpeed = document.getElementById('wind-speed');

// Unsplash API Access Key
const unsplashAccessKey = ''; // Replace with your Unsplash Access Key

searchButton.addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        showError("Please enter a city name.");
        weatherDisplay.classList.remove('show'); // Hide weather display if input is empty
        weatherIcon.src = 'images/default.png'; // Show default image if input is empty
        return;
    }

    const APIKey = ''; //Replace with your open weather map API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                showError("City not found. Please try again.");
                weatherDisplay.classList.remove('show'); // Hide weather display on error
                weatherIcon.src = 'images/404.png'; // Show the 404 image for city not found
                return;
            }

            updateUI(data);
            fetchUnsplashImage(city); // Fetch image from Unsplash
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            showError("An error occurred. Please try again later.");
            weatherDisplay.classList.remove('show'); // Hide weather display on error
            weatherIcon.src = 'images/default.png'; // Optionally set to default image on error
        });
}

function showError(message) {
    alert(message);
}

function updateUI(data) {
    const { main, weather, wind } = data;
    temperature.textContent = Math.round(main.temp);
    description.textContent = weather[0].description;
    humidityValue.textContent = main.humidity;
    windSpeed.textContent = Math.round(wind.speed);

    // Set icon and background based on weather conditions
    switch (weather[0].main) {
        case 'Clear':
            weatherIcon.src = 'images/clear.png';
            break;
        case 'Rain':
            weatherIcon.src = 'images/rain.png';
            break;
        case 'Clouds':
            weatherIcon.src = 'images/cloud.png';
            break;
        case 'Mist':
            weatherIcon.src = 'images/mist.png';
            break;
        case 'Snow':
            weatherIcon.src = 'images/snow.png';
            break;
        case 'Thunderstorm':
            weatherIcon.src = 'images/thunderstorm.png';
            break;
        default:
            weatherIcon.src = 'images/default.png';
    }

    weatherDisplay.classList.add('show'); // Show weather display when data is updated
}

function fetchUnsplashImage(city) {
    fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                // Use the first image found for the city
                const imageUrl = data.results[0].urls.regular;
                container.style.backgroundImage = `url(${imageUrl})`;
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center';
            } else {
                // Optionally set a default image if no relevant image is found
                container.style.backgroundImage = `url(images/default.png)`;
            }
        })
        .catch(error => console.error('Error fetching Unsplash image:', error));
}
