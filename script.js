let apiKey = "af180dd22e69085776c568301d9f7143";
let currentUnit = "metric"; // "metric" = Celsius, "imperial" = Fahrenheit
let lottiePlayer;

const lottieAnimations = {
  Clear: "https://assets9.lottiefiles.com/packages/lf20_jzqi3r.json",
  Clouds: "https://assets4.lottiefiles.com/packages/lf20_qmfs6z.json",
  Rain: "https://assets9.lottiefiles.com/packages/lf20_rpF2R8.json",
  Snow: "https://assets9.lottiefiles.com/packages/lf20_Wt7bNf.json",
  Thunderstorm: "https://assets1.lottiefiles.com/packages/lf20_jmBauI.json",
  Default: "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
};

function loadLottieAnimation(weatherMain) {
  const container = document.getElementById("lottie-bg");
  container.innerHTML = "";

  const animationUrl = lottieAnimations[weatherMain] || lottieAnimations["Default"];

  lottiePlayer = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: animationUrl
  });
}

function toggleUnit() {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  getWeather();
}

async function getWeather() {
  const city = document.getElementById("cityInput").value || "Delhi";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      showError(`❌ ${data.message}`);
      return;
    }

    updateWeatherUI(data);
    await getForecast(city);
  } catch (err) {
    console.error(err);
    showError("⚠️ Error fetching weather.");
  }
}

function updateWeatherUI(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const icon = document.getElementById("weatherIcon");

  icon.src = iconUrl;
  icon.classList.remove("d-none");

  const tempUnit = currentUnit === "metric" ? "°C" : "°F";
  document.getElementById("output").innerHTML = `
<strong>City:</strong> ${data.name}<br>
<strong>Temperature:</strong> ${data.main.temp} ${tempUnit}<br>
<strong>Humidity:</strong> ${data.main.humidity}%<br>
<strong>Weather:</strong> ${data.weather[0].description}<br>
<strong>Wind Speed:</strong> ${data.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"}
  `;

  document.getElementById("error").textContent = "";
  loadLottieAnimation(data.weather[0].main);
}

function showError(message) {
  document.getElementById("output").textContent = "";
  document.getElementById("weatherIcon").classList.add("d-none");
  document.getElementById("forecast").innerHTML = "";
  document.getElementById("error").textContent = message;
}

async function getForecast(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  try {
    const response = await fetch(forecastUrl);
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "<h4>5-Day Forecast:</h4>";

    if (data.cod !== "200") {
      forecastContainer.innerHTML += `<p>⚠️ Unable to fetch forecast: ${data.message}</p>`;
      return;
    }

    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const temp = forecast.main.temp;
      const desc = forecast.weather[0].description;
      const icon = forecast.weather[0].icon;

      forecastContainer.innerHTML += `
        <div class="card mb-2 p-2 text-start">
          <strong>${date}</strong><br>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Icon" width="50">
          ${desc}, <strong>${temp}°${currentUnit === "metric" ? "C" : "F"}</strong>
        </div>
      `;
    }
  } catch (err) {
    console.error("Forecast error:", err);
    document.getElementById("forecast").innerHTML = "<p>⚠️ Error loading forecast.</p>";
  }
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${currentUnit}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        updateWeatherUI(data);
        await getForecast(data.name);
      } catch (err) {
        console.error(err);
        showError("⚠️ Error fetching weather by location.");
      }
    }, () => {
      showError("⚠️ Location permission denied.");
    });
  } else {
    showError("⚠️ Geolocation is not supported.");
  }
}

  
