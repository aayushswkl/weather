const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiKey ="fc29d269a2765dfcdb95c6f5b7370014"
const searchBOx = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon");


window.addEventListener("load", defaultCity())
    async function defaultCity(){
        const response = await fetch(apiUrl + "brisbane" + `&appid=${apiKey}`)
    let data = await response.json();
    
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML = Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "kmh";

    
    if(data.weather[0].main == "Clouds"){
        weatherIcon.src= "clouds.jpg";
        document.querySelector(".description").innerHTML="cloudy";   
    }
    else if(data.weather[0].main == "Clear"){
        weatherIcon.src= "clear.jpg";
        document.querySelector(".description").innerHTML="its a clear day";
    }
    else if(data.weather[0].main == "Rain"){
        weatherIcon.src= "rain.jpg";
        document.querySelector(".description").innerHTML="RAINNNN";
    }
    else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src= "drizzle.jpg";
        document.querySelector(".description").innerHTML="Drizzly day";
    }
    else if(data.weather[0].main == "Mist"){
        weatherIcon.src= "mist.jpg";
        document.querySelector(".description").innerHTML="misty day";
    }
    }


async function checkWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
    var data = await response.json();
    
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML = Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "kmh";

    if(data.weather[0].main == "Clouds"){
        weatherIcon.src= "clouds.jpg";
        document.querySelector(".description").innerHTML="cloudy";   
    }
    else if(data.weather[0].main == "Clear"){
        weatherIcon.src= "clear.jpg";
        document.querySelector(".description").innerHTML="its a clear day";
    }
    else if(data.weather[0].main == "Rain"){
        weatherIcon.src= "rain.jpg";
        document.querySelector(".description").innerHTML="RAINNNN";
    }
    else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src= "drizzle.jpg";
        document.querySelector(".description").innerHTML="Drizzly day";
    }
    else if(data.weather[0].main == "Mist"){
        weatherIcon.src= "mist.jpg";
        document.querySelector(".description").innerHTML="misty day";
    }
}


searchButton.addEventListener("click", ()=>{
    checkWeather(searchBOx.value);
})


