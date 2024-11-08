
const { Pool } = require('pg');
const bcrypt= require('bcrypt');
const config = require('../config/index')
const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: 5432,
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    // Crear tabla usuarios si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        departamento VARCHAR(20) CHECK (departamento IN ('administracion', 'contabilidad')) DEFAULT 'administracion',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tabla 'usuarios' creada o ya existe");
    //vamos a crear la tabla factura si no existe.
    await client.query(`
        CREATE TABLE IF NOT EXISTS facturas (
          id SERIAL PRIMARY KEY,
          fecha_emision DATE NOT NULL,
          numero_factura VARCHAR(50) NOT NULL,
          proveedor VARCHAR(100) NOT NULL,
          importe DECIMAL(10, 2) NOT NULL,
          estatus VARCHAR(20) CHECK (estatus IN ('pendiente', 'rechazado', 'aprobado')) DEFAULT 'pendiente',
          url_xml VARCHAR(255) NOT NULL,
          url_pdf VARCHAR(255) NOT NULL,
          isDeleted BOOLEAN DEFAULT FALSE,
          fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_modificacion TIMESTAMP
        );
      `);

    console.log("Tabla 'facturas' creada o ya existe");

    // Insertar un usuario por defecto si no hay registros en la tabla 'usuarios'
    const result = await client.query('SELECT COUNT(*) FROM usuarios');
    if (parseInt(result.rows[0].count) === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);  
      await client.query(`
        INSERT INTO usuarios (correo, contraseña, departamento)
        VALUES ('admin@vanity.com.mx', $1, 'administracion')
      `, [hashedPassword]);
      console.log("Usuario por defecto creado.");
    }
  } catch (error) {
    console.error("Error al inicializar la base de datos", error);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDb };
