const express = require('express');
const cors= require('cors');
const mainRouter = require('../routes/index');


const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:3000'], // Agrega aquí los orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Aplicar las opciones de CORS

//Ruta principal
app.use('/api', mainRouter);


// Ruta por defecto para manejar solicitudes no encontradas
app.use((req, res) => {
  res.status(404).json({
    msg: 'Ruta no encontrada',
  });
});

// Manejo de errores
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.message || 'Internal Server Error';
  res.status(status).json({ msg, status });
};

app.use(errorHandler);

module.exports = app;
