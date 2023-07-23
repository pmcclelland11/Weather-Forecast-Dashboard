var weather = {
    'apikey': '4173ddedeb8df2d5fd8ed1441c1598fc',
    fetchWeather: function (city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error('Error fetching weather data:', error);
                alert('Weather data for the specified city could not be retrieved.');
            });
    },
    displayWeather: function (data) {
        var city = document.querySelector('.city');
        var date = document.querySelector('.date');
        var icon = document.querySelector('.icon');
        var temp = document.querySelector('.temp');
        var description = document.querySelector('.description');
        var humidity = document.querySelector('.humidity');
        var wind = document.querySelector('.wind');

        city.textContent = data.name;
        date.textContent = 'Today\'s Weather';
        icon.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        temp.textContent = data.main.temp + '°F'; // Display temperature in Fahrenheit
        description.textContent = data.weather[0].description;
        humidity.textContent = 'Humidity: ' + data.main.humidity + '%';
        wind.textContent = 'Wind Speed: ' + data.wind.speed + ' mph';
    }
};

var forecast = {
    'apikey': '4173ddedeb8df2d5fd8ed1441c1598fc',
    fetchForecast: function (city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayForecast(data))
            .catch((error) => {
                console.error('Error fetching forecast data:', error);
                alert('Forecast data for the specified city could not be retrieved.');
            });
    },
    displayForecast: function (data) {
        var forecastCards = document.querySelectorAll('.forecast-card');

        // Create an object to group the forecast data by date
        var forecastDataByDate = {};

        // Loop through the forecast data and group it by date
        data.list.forEach((forecastData) => {
            var date = forecastData.dt_txt.split(' ')[0]; // Extract the date from the timestamp

            if (!forecastDataByDate[date]) {
                forecastDataByDate[date] = forecastData;
            }
        });

        // Loop through the forecast cards and update their content for each day
        var dateKeys = Object.keys(forecastDataByDate);
        for (var i = 0; i < forecastCards.length; i++) {
            var date = forecastCards[i].querySelector('.date');
            var icon = forecastCards[i].querySelector('.icon');
            var temp = forecastCards[i].querySelector('.temp');
            var description = forecastCards[i].querySelector('.description');
            var humidity = forecastCards[i].querySelector('.humidity');
            var wind = forecastCards[i].querySelector('.wind');

            var forecastData = forecastDataByDate[dateKeys[i]];
            var formattedDate = dayjs(forecastData.dt_txt).format('MMMM D');

            date.textContent = formattedDate;
            icon.src = 'https://openweathermap.org/img/w/' + forecastData.weather[0].icon + '.png';
            temp.textContent = forecastData.main.temp + '°F'; // Display temperature in Fahrenheit
            description.textContent = forecastData.weather[0].description;
            humidity.textContent = 'Humidity: ' + forecastData.main.humidity + '%';
            wind.textContent = 'Wind Speed: ' + forecastData.wind.speed + ' mph';
        }
    }
};

function searchWeather() {
    var input = document.querySelector('.search-bar');
    var city = input.value.trim();
    if (city) {
        weather.fetchWeather(city);
        forecast.fetchForecast(city); // Fetch and display 5-day forecast
        input.value = '';

        // Show the forecast title and container when weather data is fetched
        var forecastTitle = document.querySelector('.forecast-title');
        var forecastContainer = document.querySelector('.forecast-container');
        forecastTitle.style.visibility = 'visible';
        forecastContainer.style.visibility = 'visible';
    } else {
        alert('Please enter a city name to search for weather data.');
    }
}

// Call the fetchWeather() function to retrieve weather data for the default city (Berkeley, CA)
weather.fetchWeather('Berkeley');

// Add event listener to the search button to trigger searchWeather() when clicked
document.querySelector('.search-btn').addEventListener('click', searchWeather);

// Add event listener to the search input to trigger searchWeather() when Enter key is pressed
document.querySelector('.search-bar').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        searchWeather();
    }
});