const { pool } = require('../db/connection');

class Invoice {
  constructor(url_pdf, url_xml, estatus, id, { numero_factura, proveedor, importe, fecha_emision }) {
    this.id = id;
    this.fecha_emision = fecha_emision;
    this.numero_factura = numero_factura;
    this.proveedor = proveedor;
    this.importe = importe;
    this.estatus = estatus; //pendiente', 'rechazado', 'aprobado' por default 'pendiente'
    this.url_pdf = url_pdf;
    this.url_xml = url_xml;
  }

  // Método para registrar factura
  async saveInvoice() {
    const query = `INSERT INTO facturas (fecha_emision, numero_factura, proveedor, importe,estatus, url_xml, url_pdf ) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
    const values = [this.fecha_emision, this.numero_factura, this.proveedor, this.importe, this.estatus, this.url_xml, this.url_pdf]


    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, values);

      return rows[0];
    } catch (error) {
      console.error('Error insertando factura:', error.stack);
      throw new Error('Error insertando factura'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // Método para encontrar factura duplicada
  async findOne() {
    const query = 'SELECT * FROM facturas WHERE fecha_emision=$1 AND numero_factura=$2 and proveedor=$3 AND importe=$4 AND isDeleted=FALSE';
    const values = [this.fecha_emision, this.numero_factura, this.proveedor, this.importe]
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo factura:', error.stack);
      throw new Error('Error obteniendo factura'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  //Método obtener factura por ID
  static async findById(id) {
    const query = 'SELECT * FROM facturas WHERE id = $1 AND isDeleted=FALSE';
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo factura por ID:', error.stack);
      throw new Error('Error obteniendo factura por ID'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  //Método para obtener todas las facturas.
  static async findAll({ limit, offset }) {
    const query = `SELECT id, fecha_emision, numero_factura, proveedor, importe, estatus, url_pdf, url_xml 
                   FROM facturas 
                   WHERE isDeleted = FALSE 
                   ORDER BY fecha_emision DESC 
                   LIMIT $1 OFFSET $2`;;
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, [limit, offset]);
      return rows || null;
    } catch (error) {
      console.error('Error al obtener facturas:', error.stack);
      throw new Error('Error al obtener facturas'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // Método para eliminar una factura por ID, Eliminación Logica
  static async deleteById(id, url_pdf, url_xml) {
    const query = `UPDATE facturas 
                  SET url_pdf=$1, url_xml=$2, fecha_modificacion=$3, isDeleted=TRUE 
                  WHERE id = $4 AND isDeleted=FALSE RETURNING *`;
    const fecha_modificacion = new Date()
    const values = [url_pdf, url_xml, fecha_modificacion, id]
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error eliminando factura por ID:', error.stack);
      throw new Error('Error eliminando factura por ID'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // Método para actualizar una factura por ID
  async updateById() {
    const query = `
    UPDATE facturas 
    SET fecha_emision=$1, numero_factura=$2, proveedor=$3, importe=$4, fecha_modificacion=$5
    WHERE id = $6
    AND (estatus = 'pendiente' OR estatus = 'rechazado') 
    AND isDeleted=FALSE 
    RETURNING *`;
    const fecha_modificacion = new Date();
    const values = [this.fecha_emision, this.numero_factura, this.proveedor, this.importe, fecha_modificacion, this.id]
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error al actualizar factura por ID:', error.stack);
      throw new Error('Error al actualizar factura por ID'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  //Método para actualizar el path de los archivos
  static async updateFilebyId(id, url_pdf, url_xml) {
    const query = `
    UPDATE facturas 
    SET url_pdf=$1, url_xml=$2
    WHERE id = $3 
    AND (estatus = 'pendiente' OR estatus = 'rechazado')
    AND isDeleted=FALSE  
    RETURNING *`;
    const values = [url_pdf, url_xml, id]
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error al actualizar archivos en la BD:', error.stack);
      throw new Error('Error al actualizar archivos en la BD'); // Lanza un error real en caso de fallo
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // Método para contar todas las facturas (necesario para la paginación)
  static async countAll() {
    const query = `SELECT COUNT(*) AS total FROM facturas WHERE isDeleted = FALSE`;
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query);
      return parseInt(rows[0].total, 10);
    } catch (error) {
      console.error('Error al contar facturas:', error.stack);
      throw new Error('Error al contar facturas');
    } finally {
      if (client) {
        client.release();
      }
    }
  }

}

module.exports = Invoice;
