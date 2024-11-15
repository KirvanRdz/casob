# CASO PRÁCTICO B – DESARROLLADOR WEB FULLSTACK.


## Descripción

Esta es una aplicación de registro de facturas que permite registrar, modificar y eliminar facturas desde una única página. El proyecto está dividido en dos partes independientes: el backend y el frontend, que se comunican para el manejo de los datos.

## Estructura del Proyecto

Backend: Ejecuta una API que maneja las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para las facturas.
Frontend: Una interfaz web que permite al usuario interactuar con el sistema de facturación.

Ambos componentes deben estar ejecutándose simultáneamente para que la aplicación funcione correctamente.

## Tecnologías Utilizadas

Backend: Node.js, Express
Frontend: React, Fetch para las solicitudes HTTP
Base de datos: PostgreSQL

## Requisitos Previos
Para ejecutar la aplicación, asegúrate de tener instalados en tu sistema:

Node.js y npm
Base de datos PostgreSQL

## Instalación y Ejecución

git clone https://github.com/KirvanRdz/casob.git
cd casob

## Configuración del Backend

### Entra en la carpeta del Backend:
cd Backend

### Instala las dependencias:
### `npm install`

### Inicia el servidor

### `npm run start`

El backend estará disponible en http://localhost:8080.

## Configuración del Frontend
### Entra en la carpeta del Frontend:
cd Frontend

### Instala las dependencias:
### `npm install`

### Inicia el servidor

### `npm run start`

La aplicación frontend estará disponible en http://localhost:3000.

los accesos para el Login del frontend son los siguientes:
email: admin@vanity.com.mx
password: admin123

### Notas 
La aplicación está configurada para ejecutarse en los puertos 8080 (backend) y 3000 (frontend). Asegúrate de que esos puertos estén disponibles o ajusta la configuración según sea necesario.
La comunicación entre frontend y backend se realiza a través de solicitudes HTTP, asegurando que ambos proyectos deben estar ejecutándose al mismo tiempo para que la funcionalidad sea completa.