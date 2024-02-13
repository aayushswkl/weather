const apiUrl = "http://localhost/prototype2/aayush_chaulagain_2417735.php?q=";
const searchBOx = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon");
const date = document.getElementById("date");
const form = document.querySelector("form");

window.addEventListener("load", () => {
  // Check if online, fetch data from API, otherwise fetch from local storage
  if (navigator.onLine) {
    checkWeather("Brisbane");
  } else {
    const storedData = localStorage.getItem("Brisbane");
    const data = JSON.parse(storedData);

    if (data) {
      displayWeatherFromStorage(data);
    } else {
      alert("No data stored in local storage");
    }
  }
});

async function checkWeather(city) {
  try {
    const response = await fetch(`http://localhost/prototype2/aayush_chaulagain_2417735.php?q=${city}`);
    const data = await response.json();

    console.log(data);
 

    document.getElementById("city").innerText = data.city;
    document.getElementById("temperature").innerText = Math.round(data.temperature) + " °C";
    document.getElementById("humidity").innerText = data.humidity + " %";
    document.querySelector(".wind").innerText = data.wind_speed + " kmh";
    document.getElementById("pressure").innerText = data.pressure + " pa";

    weatherIcon.src = `https://openweathermap.org/img/wn/${data.iconcode}@2x.png`;

    document.querySelector("#description").innerText = data.weather_condition;
    date.innerText = data.day_date;

    localStorage.setItem(city, JSON.stringify(data));

  
  } catch (error) {
    alert(`something went wrong ${error}`);
  }
}

function displayWeatherFromStorage(data) {
  // Display weather data from local storage
  document.getElementById("city").innerText = data.city;
  document.getElementById("temperature").innerText =
    Math.round(data.temperature) + " °C";
  document.getElementById("humidity").innerText = data.humidity + " %";
  document.querySelector(".wind").innerText = data.wind_speed + " kmh";
  document.getElementById("pressure").innerText = data.pressure + " pa";

  weatherIcon.src = `https://openweathermap.org/img/wn/${data.iconcode}@2x.png`;

  document.querySelector("#description").innerText = data.weather_condition;
  date.innerText = data.day_date;
}


form.addEventListener("submit",(event)=>{
  event.preventDefault();
  checkWeather(searchBOx.value);
})



async function fetchLast7DaysWeather() {
  try {
    const response = await fetch('http://localhost/prototype2/aayush_chaulagain_2417735.php?last7days=true');
    let data = await response.text(); 
    const arrayData = data.substring(data.indexOf('['), data.lastIndexOf(']') + 1);
    const weatherData = JSON.parse(arrayData);
    displayWeatherData(weatherData);
  } catch (error) {
    console.error('Error fetching last 7 days weather:', error);
  }
}

function displayWeatherData(weatherData) {

  const weatherDataElement = document.getElementById('weatherData');
  weatherDataElement.innerHTML = ''; 

  weatherData.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('weather-day');
    dayElement.innerHTML = `
      <div class="date">Date: ${day.day_date}</div>
      <div class="temperature">Temperature: ${Math.round(day.temperature)}°C</div>
      <div class="weather-icon">
        <img src="https://openweathermap.org/img/wn/${day.iconcode}@2x.png" alt="Weather Icon">
      </div>
    `;
    weatherDataElement.appendChild(dayElement);
  });
}

fetchLast7DaysWeather();
