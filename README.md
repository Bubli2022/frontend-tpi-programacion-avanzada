# Weather App - Frontend

Trabajo Práctico Integrador  
Alumnos:

-  Lautaro Vergara (DNI 47307319)
-  Ignacio Heredia (DNI 47064312)
-  Ariel Marcos Perez (DNI 29122141)

---

## Descripción

Esta es la aplicación **frontend** de la Weather App, desarrollada con **React**. Permite consultar el clima actual utilizando la ubicación del usuario o buscando una ciudad específica. Se comunica con una API propia desarrollada en **FastAPI (Python)** que consume los datos de OpenWeatherMap.

---

## Tecnologías

-  React
-  JavaScript (ES6+)
-  Axios (para solicitudes HTTP)
-  CSS/HTML
-  API personalizada (FastAPI - Python)

---

Enlaces de weather app del tpi de programación avanzada:

Enlace conectado en linea a través de Netlify del frontend:
https://tpi-programacion-avanzada.netlify.app/

Tecnologías usadas Frontend: React, Javascript, Axios, CSS/HTML, API personalizada (FastAPI - Python)

Enlace conectado en linea a traves de Render del backend:

https://backend-tpi-programacion-avanzada.onrender.com/docs

Tecnologías usadas Backend: Python, FastAPI, Uvicorn, HTTPX, python-dotenv, OpenWeatherMap API

Repositorios de GitHub:

Frontend:
https://github.com/Bubli2022/frontend-tpi-programacion-avanzada.git

Backend:
https://github.com/Bubli2022/backend-tpi-programacion-avanzada.git

## Instalación

### 1. Clonar el repositorio y acceder a la carpeta `frontend`:

````bash
git clone https://github.com/Bubli2022/frontend-tpi-programacion-avanzada.git
cd frontend

##2. Instalar dependencias:
bash

npm install

##3. Configurar las variables de entorno:
# Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

env

REACT_APP_API_URL=http://localhost:8000
# Asegurate de que la URL corresponda al backend de FastAPI en ejecución.

# Uso
# Para ejecutar la aplicación en modo desarrollo:
bash

npm start

# Esto abrirá automáticamente la app en:

arduino

http://localhost:3000

# Funcionalidades
# Solicita permisos de geolocalización para mostrar el clima actual.

# Permite buscar el clima por nombre de ciudad.

# Alterna entre unidades de temperatura Celsius y Fahrenheit.

# Muestra:

# Icono representativo del clima

# Temperatura actual

# Velocidad del viento

# Porcentaje de nubosidad

# Presión atmosférica

# Notas
# Es obligatorio tener el backend corriendo para obtener los datos climáticos.

# El backend debe tener una clave de API válida de OpenWeatherMap en su archivo .env.

# Para construir la versión optimizada de producción:

bash

npm run build

# Licencia
# Este proyecto fue desarrollado con fines académicos para la materia Programación Avanzada en la Universidad Nacional Almirante Brown.
# ```
````
