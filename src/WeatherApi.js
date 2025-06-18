import React, { useEffect, useState } from "react"
import axios from "axios"

/**
 * Clase que representa el servicio para obtener datos del clima desde el backend.
 * Aplicando POO:
 * - Encapsulamos la URL base y los métodos para hacer las consultas HTTP dentro de un objeto.
 * - Cada método corresponde a una responsabilidad concreta: obtener clima por ciudad o por coordenadas.
 * - Esto promueve la reutilización y el mantenimiento, separando la lógica de acceso a datos del componente React.
 */
class WeatherService {
   constructor(baseUrl) {
      // Atributo que guarda la URL base del backend, para usar en todas las consultas
      this.baseUrl = baseUrl
   }

   /**
    * Método que realiza la consulta al backend para obtener clima por ciudad.
    * - Método asincrónico que retorna los datos del clima.
    * - Centraliza la lógica de la petición HTTP para reutilizar en cualquier lugar que se necesite.
    */
   async getByCity(city) {
      try {
         const response = await axios.get(`${this.baseUrl}/weather/city`, {
            params: { city },
         })
         return response.data // Retorna el JSON con los datos para ser usado en la UI
      } catch (error) {
         // Propaga el error para que quien llame pueda manejarlo (por ejemplo, mostrar alertas)
         throw error
      }
   }

   /**
    * Método que obtiene el clima mediante latitud y longitud.
    * Similar a getByCity, pero con diferente tipo de parámetros.
    * Demuestra polimorfismo conceptual: mismo objetivo, distintos inputs.
    */
   async getByCoordinates(lat, lon) {
      try {
         const response = await axios.get(
            `${this.baseUrl}/weather/coordinates`,
            {
               params: { lat, lon },
            }
         )
         return response.data
      } catch (error) {
         throw error
      }
   }
}

// Creamos una instancia única (singleton-like) del servicio afuera del componente React.
// Así evitamos crear múltiples instancias en cada render, mejorando eficiencia.
const weatherService = new WeatherService(process.env.REACT_APP_API_URL)

/**
 * Componente funcional que representa la interfaz de usuario para mostrar el clima.
 *
 * Aplicación de React hooks para manejar estado local y efectos secundarios.
 * La lógica de obtención de datos se delega a la clase WeatherService,
 * asegurando separación clara entre UI y acceso a datos (single responsibility principle).
 */
const WeatherApi = () => {
   // useState define atributos (estado) del componente: datos del clima, control de carga, errores, etc.
   const [weather, setWeather] = useState({})
   const [isCelcius, setIsCelcius] = useState(true)
   const [geoError, setGeoError] = useState(false)
   const [city, setCity] = useState("")
   const [loading, setLoading] = useState(false)

   /**
    * Método (función) dentro del componente que usa el objeto weatherService para obtener datos por ciudad.
    * Demuestra cómo el componente actúa como consumidor del objeto WeatherService,
    * solicitando datos y actualizando su estado local con la respuesta.
    */
   const fetchWeatherByCity = async (cityName) => {
      if (!cityName) return
      setLoading(true) // Indicador para mostrar UI de carga
      try {
         const data = await weatherService.getByCity(cityName)
         setWeather(data) // Actualizamos el estado con los datos recibidos
      } catch (err) {
         console.error("Error fetching weather by city:", err)
         alert("No se encontró la ciudad, por favor verifica el nombre.")
      } finally {
         setLoading(false) // Terminamos la carga
      }
   }

   // useEffect con arreglo vacío [] simula el método componentDidMount de clase,
   // ejecutándose solo una vez al montar el componente.
   // Aquí se gestiona la obtención inicial del clima por geolocalización.
   useEffect(() => {
      /**
       * Método interno para obtener clima por coordenadas usando WeatherService.
       * Permite mantener la lógica organizada dentro del efecto.
       */
      const fetchWeatherByCoords = async (lat, lon) => {
         setLoading(true)
         try {
            const data = await weatherService.getByCoordinates(lat, lon)
            setWeather(data)
         } catch (err) {
            console.error("Error fetching weather by coordinates:", err)
         } finally {
            setLoading(false)
         }
      }

      // API de navegador para obtener ubicación actual (side effect)
      navigator.geolocation.getCurrentPosition(
         (pos) => {
            const { latitude, longitude } = pos.coords
            fetchWeatherByCoords(latitude, longitude)
         },
         (err) => {
            console.error("Geolocation error:", err)
            setGeoError(true) // Control de error para UI
         }
      )
   }, [])

   // Renderizado condicional basado en estado, para manejar errores y estados de carga.
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

   // JSX que representa la UI, usando los datos del estado weather.
   // Aquí el componente React actúa como vista en el patrón MVC.
   return (
      <div className="card">
         <h1 className="weather--gif">WEATHER APP</h1>

         {/* Input controlado para búsqueda por ciudad */}
         <div style={{ marginBottom: "1rem" }}>
            <input
               type="text"
               placeholder="Escribí una ciudad..."
               value={city}
               onChange={(e) => setCity(e.target.value)} // Actualiza atributo 'city'
               onKeyDown={(e) => {
                  if (e.key === "Enter") fetchWeatherByCity(city) // Invoca método para consultar clima
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
