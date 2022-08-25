const tempContainer = document.querySelector(".temp");
const windContainer = document.querySelector(".wind");
const unitToggleBtn = document.querySelector(".toggle-btn");
const ToggleBtnInnerCircle = document.querySelector(".inner-circle");
const unitHeader = document.querySelector(".unit-header");
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search button");
let currSearch = "";
// weather class
const weather = {
    api_key: "1d0a5272af38a018174b126e2c5e4226",
    locData: {},
    /**
   * fetch weather simply fetches weather data from openweathermap api
   *
   * @param {String} city - city name to be searched
   * @param {String} [unit = 'imperial']- units to be used in weather. default imperial units
   */ fetchWeather: function(city, unit = "imperial") {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${this.api_key}`).then((response)=>response.json()).then((data)=>this.displayWeather(data, unit)).catch((e)=>console.log(e, "\uD83D\uDCA5"));
    },
    /**
   * function that displays all the weather information for the client
   *
   * @param {Object} data - an object containing the response data from openweathermap api fetch
   * @param {String} unit - the current units being used
   */ displayWeather: function(data, unit) {
        console.log(data);
        const { name  } = data;
        const { icon , description  } = data.weather[0];
        const { temp , humidity  } = data.main;
        const { speed  } = data.wind;
        document.querySelector(".city").innerText = `Weather in ${name}`;
        document.querySelector(".icon").src = `http://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerText = description;
        tempContainer.innerHTML = Math.round(temp) + `${unit === "imperial" ? " &#x2109" : " &#8451"}`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        windContainer.innerText = "Wind speed: " + Math.round(speed) + `${unit === "imperial" ? " mp/h" : " km/h"}`;
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1920x1080/?${name}&content_filter=high&topics=id_or_slug')`;
    },
    // function that grabs search bar value and sends it to fetchWeather() function in weather class
    search: function() {
        if (!searchBar.value) return;
        unitToggleBtn.classList.remove("active");
        currSearch = searchBar.value;
        this.fetchWeather(currSearch);
        searchBar.value = "";
    }
};
// listen to click on search or enter button to call weather.search()
searchBtn.addEventListener("click", function() {
    weather.search();
});
document.addEventListener("keyup", function(e) {
    console.log(e);
    if (e.key === "Enter") weather.search();
});
// toggle button that switches between metric and imperial units
unitToggleBtn.addEventListener("click", function() {
    console.log(currSearch);
    if (this.classList.contains("active")) {
        this.classList.remove("active");
        unitHeader.innerHTML = "&#x2109";
        weather.fetchWeather(currSearch);
    } else if (!this.classList.contains("active")) {
        this.classList.add("active");
        unitHeader.innerHTML = "&#8451";
        weather.fetchWeather(currSearch, "metric");
    }
});
// on app start grab user location data
window.addEventListener("load", function() {
    const getLocation = function() {
        return new Promise(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition((position)=>resolve(position), (err)=>reject(err));
        });
    };
    // reverse geocode user location
    const location = async function() {
        try {
            const pos = await getLocation();
            const { latitude: lat , longitude: lng  } = pos.coords;
            console.log(lat, lng);
            const revGeo = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
            console.log(revGeo);
            if (!revGeo.ok) {
                console.log(revGeo);
                // geocode.xyz likes to throw 403 errors for a reason i couldn't find on client side
                // here's a work around
                if (revGeo.status === 403) return window.location.reload();
                throw new Error("Problem getting your location data");
            }
            locData = await revGeo.json();
            currSearch = locData.city;
            weather.fetchWeather(currSearch);
        } catch (err) {
            console.log(err);
        }
    };
    location();
});

//# sourceMappingURL=index.1c974c2f.js.map
