async function getWeather() {
  const city = document.getElementById("cityInput").value || "Delhi";
  const apiKey = "a09135bbfe567589bcbe93694a53934e"; // Your API key

  const url = https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      document.getElementById("output").textContent = "";
      document.getElementById("weatherIcon").classList.add("d-none");
      document.getElementById("error").textContent = ❌ ${data.message};
      return;
    }

    const iconCode = data.weather[0].icon;
    const iconUrl = https://openweathermap.org/img/wn/${iconCode}@2x.png;
    const icon = document.getElementById("weatherIcon");
    icon.src = iconUrl;
    icon.classList.remove("d-none");

    document.getElementById("output").textContent = `
City: ${data.name}
Temperature: ${data.main.temp} °C
Humidity: ${data.main.humidity}%
Weather: ${data.weather[0].description}
Wind Speed: ${data.wind.speed} m/s
    `;

    document.getElementById("error").textContent = "";
  } catch (err) {
    console.error(err);
    document.getElementById("output").textContent = "";
    document.getElementById("weatherIcon").classList.add("d-none");
    document.getElementById("error").textContent = "⚠️ Error fetching weather.";
  }
}