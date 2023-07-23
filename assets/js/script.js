// Initialize the weather object using the OpenWeather API and personal API key
var weather = {
    'apikey': '4173ddedeb8df2d5fd8ed1441c1598fc',
    fetchWeather: function (city) {
        // Fetching current weather data
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error('Error fetching weather data:', error);
                alert('Weather data for the specified city could not be retrieved. Check city name and try');
            });
    },
    // Function used to display current weather data
    displayWeather: function (data) {
        // Use querySelector to target weather display elements
        var city = document.querySelector('.city');
        var date = document.querySelector('.date');
        var icon = document.querySelector('.icon');
        var temp = document.querySelector('.temp');
        var description = document.querySelector('.description');
        var humidity = document.querySelector('.humidity');
        var wind = document.querySelector('.wind');

        // Update HTML element content with fetched data
        city.textContent = data.name;
        date.textContent = 'Today\'s Weather';
        icon.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        temp.textContent = data.main.temp + '°F';
        description.textContent = data.weather[0].description;
        humidity.textContent = 'Humidity: ' + data.main.humidity + '%';
        wind.textContent = 'Wind Speed: ' + data.wind.speed + ' mph';
    }
};

// Initialize the weather forecast object using the OpenWeather API and personal API key
var forecast = {
    'apikey': '4173ddedeb8df2d5fd8ed1441c1598fc',
    fetchForecast: function (city) {
        // Fetching forecasted weather data
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayForecast(data))
            .catch((error) => {
                console.error('Error fetching forecast data:', error);
            });
    },
     // Function used to display forecast weather data
    displayForecast: function (data) {
        var forecastCards = document.querySelectorAll('.forecast-card');
        var forecastDataByDate = {};

        // Organizing fetched data by date
        data.list.forEach((forecastData) => {
            var date = forecastData.dt_txt.split(' ')[0];

            if (!forecastDataByDate[date]) {
                forecastDataByDate[date] = forecastData;
            }
        });

        // Update HTML element content with fetched data
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
            temp.textContent = forecastData.main.temp + '°F';
            description.textContent = forecastData.weather[0].description;
            humidity.textContent = 'Humidity: ' + forecastData.main.humidity + '%';
            wind.textContent = 'Wind Speed: ' + forecastData.wind.speed + ' mph';
        }
    }
};

// Function used to fetch weather/forecast data when the search button is clicked
function searchWeather() {
    var input = document.querySelector('.search-bar');
    var city = input.value.trim();
    if (city) {
        // Save the city to localStorage
        saveCityToLocalStorage(city);

        // Fetch and display weather data
        weather.fetchWeather(city);
        forecast.fetchForecast(city);
        input.value = '';

        // Unhide the forecast section of the webpage
        var forecastTitle = document.querySelector('.forecast-title');
        var forecastContainer = document.querySelector('.forecast-container');
        forecastTitle.style.visibility = 'visible';
        forecastContainer.style.visibility = 'visible';

        // Load the updated search history
        loadSearchHistory();
    } else {
        alert('Please enter a city name to search for weather data.');
    }
}

// Function used to save the searched city to localStorage (aka search history)
function saveCityToLocalStorage(city) {
    var searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        var historyArray = JSON.parse(searchHistory);
        if (!historyArray.includes(city)) {
            historyArray.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(historyArray));
        }
    } else {
        var historyArray = [city];
        localStorage.setItem('searchHistory', JSON.stringify(historyArray));
    }
}

// Function used to load search history from localStorage
function loadSearchHistory() {
    var searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        var historyArray = JSON.parse(searchHistory);
        var dropdownContent = document.getElementById('searchHistoryDropdown');
        dropdownContent.innerHTML = '';

        for (var i = 0; i < historyArray.length; i++) {
            var cityName = historyArray[i];
            var dropdownItem = document.createElement('a');
            dropdownItem.textContent = cityName;
            dropdownItem.addEventListener('click', function () {
                // Fetch and display waether data for cooresponding dat
                weather.fetchWeather(this.textContent);
                forecast.fetchForecast(this.textContent);
            });
            dropdownContent.appendChild(dropdownItem);
        }
    }
}

// Adding event listener to the search history button
document.querySelector('.dropdown-btn').addEventListener('click', function () {
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
});

// Adding event listener to help close the search history dropdown list
document.addEventListener('click', function (event) {
    var dropdownContent = document.querySelector('.dropdown-content');
    var dropdownBtn = document.querySelector('.dropdown-btn');
    
    if (!dropdownContent.contains(event.target) && event.target !== dropdownBtn) {
        dropdownContent.style.display = 'none';
    }
});

// Displaying the current weather for Berkeley upon loading the webpage
weather.fetchWeather('Berkeley');

// Adding event listeners to the search button for both a click event and when the 'enter' key is pressed
document.querySelector('.search-btn').addEventListener('click', searchWeather);
document.querySelector('.search-bar').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchWeather();
    }
});

// Load search history when page is loaded
loadSearchHistory();

// Function to set the random background image
function setRandomBackgroundImage() {
    var mainContainer = document.querySelector('.main-container');
    var randomImageURL = `https://source.unsplash.com/1905x810/?nature,water,cities`;
    mainContainer.style.backgroundImage = `url('${randomImageURL}')`;
}

// Call the function to set the random background image when the page loads
window.addEventListener('load', setRandomBackgroundImage);