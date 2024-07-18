
const mainCity = document.getElementById("mainCity");
const mainTemp = document.getElementById("mainTemp");
const mainWind = document.getElementById("mainWind");
const mainHumidity = document.getElementById("mainHumidity");
const mainImg = document.getElementById("mainImg");
const mainFeels = document.getElementById("mainFeels");
const mainDate = document.getElementById("date");
const cards = document.querySelector(".cards");

const loader = document.querySelector(".loader");
const mainContainer = document.querySelector(".maincontainer");
let toggleLoader = false;

if (toggleLoader) {
    loader.style.display = "block";
} else {
    loader.style.display = "none";
}

const date = new Date();
mainDate.textContent = date.toLocaleDateString();


const inputCity = document.querySelector("input");
const searchBtn = document.querySelector("#search")
const currentLocationBtn = document.querySelector("#currentLocationBtn")

let userLatitude = undefined;
let userLongitude = undefined;


searchBtn.addEventListener("click", () => {
    if (!inputCity.value) {
        alert("Please enter City Name");
    } else {

        fetchForecast(false, false, inputCity.value);
        showPosition(false, inputCity.value);
        console.log("btn clicked")
        console.log(inputCity.value)
    }
})


currentLocationBtn.addEventListener("click", () => {
    getCurrentUserLocation();
})





const showPosition = async (position, location = false) => {
    if (location) {
        console.log("location bel")
        console.log(location)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${"58eaec513d918c56e6a52478dda1c8e8"}&units=metric`)
        const data = await response.json();
        setMainData(data);
    } else {

        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        console.log(`Latitude: ${userLatitude}, Longitude: ${userLongitude}`);
        // const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${"London"}&appid=${58eaec513d918c56e6a52478dda1c8e8}&units=metric`)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&appid=${"58eaec513d918c56e6a52478dda1c8e8"}&units=metric`)
        const data = await response.json();
        setMainData(data);
        fetchForecast(userLatitude, userLongitude);
        console.log(data);
    }
}
const getCurrentUserLocation = () => {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log("Geolocation is not supported by this browser, try in another one.");
        }
    }


    const showError = (err) => {
        alert(err.message)
        return console.warn(err)
    }
    getLocation();
}


const fetchForecast = async (userLatitude, userLongitude, location = false) => {
    let response = undefined;
    if (location) {
        console.log("called for only location")
        console.log(location)
        try {

            response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${"58eaec513d918c56e6a52478dda1c8e8"}&units=metric`);
        } catch (error) {
            console.log("err occured !!!!!!!!!!!!!!!!")
            console.log(error)
        }

    } else {
        try {

            response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${userLatitude}&lon=${userLongitude}&appid=${"58eaec513d918c56e6a52478dda1c8e8"}&units=metric`);
        } catch (error) {
            console.log(error)
        }
    }

    const data = await response.json();
    console.log(data);
    console.log(data.cod);

    if (data.cod == 404) {
        alert("Invalid City")
        document.location.reload();
        console.log(data.cod)
    }

    const forecast = data.list.filter((item, index) => {
        return index % 8 === 0;
    })
    cards.innerHTML = "";
    console.log("forecast below")
    console.log(forecast);


    forecast.map((item, index) => {
        const cardContent = document.createElement("div");
        cardContent.classList.add("card", "w-full", "xs:w-[13rem]", "p-4", "backdrop-blur-sm", "bg-[#ffffff5c]", "transition-all", "hover:bg-[#ff00005c]", "border", "border-white");


        cardContent.innerHTML = `
            <h3>${item.dt_txt.split(" ")[0]}</h3>
            <img
              src="http://openweathermap.org/img/w/${item.weather[0].icon}.png"
              width="100px"
              alt=""
            />
            <p>Temperature: ${item.main.temp}0C</p>
            <p>Wind: ${item.wind.speed} M/S</p>
            <p>Humidity: ${item.main.humidity}%</p>
        `

        cards.appendChild(cardContent);


    })
}


const setMainData = (data) => {
    console.log(data)

    mainCity.textContent = data.name;
    mainTemp.textContent = data.main.temp;
    mainWind.textContent = data.wind.speed;
    mainHumidity.textContent = data.main.humidity;
    mainImg.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    mainFeels.textContent = data.weather[0].description;

}


getCurrentUserLocation();

