import React, { useEffect, useState } from "react"
import axios from "axios"

const WeatherApi = () => {
   const [weather, setWeather] = useState({})
   const [isCelcius, setIsCelcius] = useState(true)
   const [geoError, setGeoError] = useState(false)
   const [city, setCity] = useState("") // Estado para el input ciudad
   const [loading, setLoading] = useState(false) // Para controlar carga de datos
   const API_URL = process.env.REACT_APP_API_URL

   // Función para obtener clima por ciudad
   const fetchWeatherByCity = (cityName) => {
      if (!cityName) return
      setLoading(true)
      axios
         .get(`${API_URL}/weather/city`, { params: { city: cityName } })
         .then((res) => setWeather(res.data))
         .catch((err) => {
            console.error("Error fetching weather by city:", err)
            alert("No se encontró la ciudad, por favor verifica el nombre.")
         })
         .finally(() => setLoading(false))
   }

   useEffect(() => {
      // Función para obtener clima por coordenadas
      const fetchWeatherByCoords = (lat, lon) => {
         setLoading(true)
         axios
            .get(`${API_URL}/weather/coordinates`, { params: { lat, lon } })
            .then((res) => setWeather(res.data))
            .catch((err) => console.error("Error fetching weather:", err))
            .finally(() => setLoading(false))
      }

      navigator.geolocation.getCurrentPosition(
         (pos) => {
            const { latitude, longitude } = pos.coords
            fetchWeatherByCoords(latitude, longitude)
         },
         (err) => {
            console.error("Geolocation error:", err)
            setGeoError(true)
         }
      )
   }, [API_URL])

   if (geoError)
      return (
         <h2 style={{ color: "white" }}>
            Por favor, permití la ubicación para ver el clima o buscá una
            ciudad.
         </h2>
      )

   if (loading)
      return <h2 style={{ color: "white" }}>Cargando datos del clima...</h2>

   if (!weather.main) {
      return (
         <div
            style={{ textAlign: "center", marginTop: "100px", color: "white" }}
         >
            <div className="spinner"></div>
            <p>Cargando clima...</p>
         </div>
      )
   }

   return (
      <div className="card">
         <h1 className="weather--gif">WEATHER APP</h1>

         {/* Input para búsqueda por ciudad */}
         <div style={{ marginBottom: "1rem" }}>
            <input
               type="text"
               placeholder="Escribí una ciudad..."
               value={city}
               onChange={(e) => setCity(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") fetchWeatherByCity(city)
               }}
               style={{ padding: "0.5rem", width: "70%" }}
            />
            <button
               onClick={() => fetchWeatherByCity(city)}
               style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
            >
               Buscar
            </button>
         </div>

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
