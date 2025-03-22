import React, { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {
  let [city, setCity] = useState("")
  let [weather, setWeather] = useState(null)

  let check = async () => {
    if (!city) {
      alert("Please enter a city name! 🌍")
      return
    }

    try {
      let geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      )

      if (!geoRes.data.results) {
        alert("City not found! ❌")
        return
      }

      let { latitude, longitude, name } = geoRes.data.results[0]

      let weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
      )

      setWeather({
        location: name,
        temperature: weatherRes.data.hourly.temperature_2m.slice(0, 10)
      })
    } catch (error) {
      console.error("Error fetching weather:", error)
      alert("Something went wrong! 😞")
    }
  }

  return (
    <div className="container">
      <h1 className="title">🔰 Weather App</h1>

      <div className="search">
        <input
          type="text" placeholder="Enter City Name..." value={city} onChange={(e) => setCity(e.target.value)} />
        <button onClick={check}>Check Weather</button>
      </div>

      {weather && (
        <div className="output">
          <h2>📍 {weather.location}</h2>
          <div className="weather">
            {weather.temperature.map((temp, index) => (
              <p key={index}>🌤️ Hour {index + 1}: {temp}°C</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
