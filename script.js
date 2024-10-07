let searchInput = document.querySelector(".search-input");
let locationButton = document.querySelector(".location-button");
let currentWeatherDiv = document.querySelector(".current-weather");
let hourlyWeatherDiv = document.querySelector(".hourly-weather .weather-list");
let no_result = document.querySelector(".no-result");

// console.log("DOM fully loaded and parsed");

const API_KEY = "82b042dd596d495f806212903240610";
const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],

};

const displayHourlyForcast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000; // 24 hours from now
    const next24HoursData = hourlyData.filter(({ time }) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    // Create hourly forecast HTML
    hourlyWeatherDiv.innerHTML = next24HoursData.map(item => {
        const temperature = Math.floor(item.temp_c);
        const time = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Display only hour and minute
        const weatherIconSrc = `https:${item.condition.icon}`;
        return `<li class="weather-item">
                    <p class="time">${time}</p>
                    <img src="${weatherIconSrc}" class="weather-icon" alt="weather icon">
                    <p class="temperature">${temperature}°C</p>
                </li>`;
    }).join(""); // Join the array of list items into a single string
};



const getWeatherDetails = async (API_URL) => {
    currentWeatherDiv.classList.remove("hidden");
    hourlyWeatherDiv.classList.remove("hidden");
    no_result.classList.remove("show");

    try {

        //extraction weather details from api and parse the response as json
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);
        const temperture = Math.floor(data.current.temp_c);
        const descreption = data.current.condition.text;
        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon.includes(data.current.condition.code)]);
        currentWeatherDiv.querySelector(".weather-icon").src = data.current.condition.icon;
        currentWeatherDiv.querySelector(".tempreture ").innerHTML = `${temperture}<span>°C</span>`;
        currentWeatherDiv.querySelector(".description").innerText = descreption;

        // console.log(`Temperature: ${temperture}, Description: ${descreption}`);


        const forecastDay1 = data.forecast.forecastday[0].hour;
        const forecastDay2 = data.forecast.forecastday[1]?.hour || [];
        const combinedHourlyData = [...forecastDay1, ...forecastDay2];
        // console.log(combinedHourlyData);
        displayHourlyForcast(combinedHourlyData);
        searchInput.value = data.location.name;
    } catch (error) {
        currentWeatherDiv.classList.add("hidden");
        hourlyWeatherDiv.classList.add("hidden");
        no_result.classList.add("show");
        console.log("hi")
    }
}

const setWeatherRequest = (cityName) => {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
    getWeatherDetails(API_URL);
}

searchInput.addEventListener("keyup", (e) => {
    const cityName = searchInput.value.trim();

    if (e.key == "Enter" && cityName) {
        // console.log(cityName);
        setWeatherRequest(cityName);
    }
})
locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude} ,${longitude}& days=2`;
        getWeatherDetails(API_URL);



    }


        , error => {
            alert("location access denied")
        })
})
setWeatherRequest("london");