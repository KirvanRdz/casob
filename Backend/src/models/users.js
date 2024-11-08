const {pool} = require('../db/connection');

class User {
  constructor( { id, correo, contraseña, departamento}) {
    this.id = id;
    this.correo = correo;
    this.contraseña = contraseña;
    this.departamento = departamento;
    
  }

  // Método para encontrar un usuario por correo electrónico
  static async findOneByEmail(correo) {
    const query = 'SELECT * FROM usuarios WHERE correo = $1';
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(query, [correo]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo usuario por correo:', error.stack);
      return 'ERROR';
    } finally {
      if (client) {
        client.release();
      }
    }
  }

}

module.exports = User;
