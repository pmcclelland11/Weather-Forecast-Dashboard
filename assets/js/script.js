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
        temp.textContent = data.main.temp + '°F';
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

        var forecastDataByDate = {};

        data.list.forEach((forecastData) => {
            var date = forecastData.dt_txt.split(' ')[0];

            if (!forecastDataByDate[date]) {
                forecastDataByDate[date] = forecastData;
            }
        });

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

function searchWeather() {
    var input = document.querySelector('.search-bar');
    var city = input.value.trim();
    if (city) {
        saveCityToLocalStorage(city);

        weather.fetchWeather(city);
        forecast.fetchForecast(city);
        input.value = '';

        var forecastTitle = document.querySelector('.forecast-title');
        var forecastContainer = document.querySelector('.forecast-container');
        forecastTitle.style.visibility = 'visible';
        forecastContainer.style.visibility = 'visible';
    } else {
        alert('Please enter a city name to search for weather data.');
    }
}

function saveCityToLocalStorage(city) {
    var searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        var historyArray = JSON.parse(searchHistory);
        historyArray.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(historyArray));
    } else {
        var historyArray = [city];
        localStorage.setItem('searchHistory', JSON.stringify(historyArray));
    }

    loadSearchHistory();
}

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
                weather.fetchWeather(this.textContent);
                forecast.fetchForecast(this.textContent);
            });
            dropdownContent.appendChild(dropdownItem);
        }
    }
}

document.querySelector('.dropdown-btn').addEventListener('click', function () {
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
});

// Close the dropdown when clicking outside of it
document.addEventListener('click', function (event) {
    var dropdownContent = document.querySelector('.dropdown-content');
    var dropdownBtn = document.querySelector('.dropdown-btn');
    
    if (!dropdownContent.contains(event.target) && event.target !== dropdownBtn) {
        dropdownContent.style.display = 'none';
    }
});

weather.fetchWeather('Berkeley');

document.querySelector('.search-btn').addEventListener('click', searchWeather);

document.querySelector('.search-bar').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchWeather();
    }
});

loadSearchHistory();
