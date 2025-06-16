import React, { useEffect, useState } from "react"
import axios from "axios"

const WeatherApi = () => {
   const [weather, setWeather] = useState({})
   const [isCelcius, setIsCelcius] = useState(true)
   const [geoError, setGeoError] = useState(false)

   const API_URL = process.env.REACT_APP_API_URL

   useEffect(() => {
      navigator.geolocation.getCurrentPosition(success, error)

      function success(pos) {
         const { latitude, longitude } = pos.coords

         axios
            .get(`${API_URL}/weather/coordinates`, {
               params: {
                  lat: latitude,
                  lon: longitude,
               },
            })
            .then((res) => setWeather(res.data))
            .catch((err) => console.error("Error fetching weather:", err))
      }
      function error(err) {
         console.error("Geolocation error:", err)
         // podrías mostrar un mensaje amigable también
      }
   }, [])

   if (geoError)
      return <h2>Por favor, permití la ubicación para ver el clima.</h2>
   // Aquí validamos que haya datos antes de intentar renderizarlos
   if (!weather.main) return <h2>Loading weather data...</h2>

   return (
      <div className="card">
         <h1 className="weather--gif">WEATHER APP</h1>
         <img
            src={`http://openweathermap.org/img/wn/${weather.weather?.[0].icon}.png`}
            alt=""
         />
         <h2>
            {weather.name}, {weather.sys?.country}
         </h2>
         <h3>
            {isCelcius ? weather.main?.temp : weather.main?.temp * (9 / 5) + 32}{" "}
            {isCelcius ? "°C" : "°F"} {weather.weather?.[0].description}
         </h3>
         <h3>
            <i className="fa-solid fa-wind"></i> Wind Speed:{" "}
            {weather.wind?.speed} m/s
         </h3>
         <h3>
            <i className="fa-solid fa-cloud"></i> Clouds: {weather.clouds?.all}%
         </h3>
         <h3>
            <i className="fa-solid fa-temperature-three-quarters"></i> Pressure:{" "}
            {weather.main?.pressure} hPa
         </h3>
         <button onClick={() => setIsCelcius(!isCelcius)}>
            Degrees °C / °F
         </button>
      </div>
   )
}

export default WeatherApi
