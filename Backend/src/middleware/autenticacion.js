const jwt = require('jsonwebtoken');
const config = require('../config') ;
/*=============================================
Verificar token
=============================================*/

const verificarToken = (req, res, next) => {
	// Extraer token del header de Authorization
	let authHeader = req.get("Authorization");
  
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
	  return res.status(401).json({
		status: 401,
		msg: "No se proporcionó un token válido",
	  });
	}
  
	// Remover el prefijo 'Bearer ' del token
	const token = authHeader.split(" ")[1];
  
	jwt.verify(token, config.SECRET_TOKEN, (err, decoded) => {
	  if (err) {
		// Manejar errores específicos de JWT
		const message =
		  err.name === "TokenExpiredError"
			? "El token ha expirado, vuelve a iniciar sesión"
			: "El token de autorización no es válido";
  
		return res.status(401).json({
		  status: 401,
		  msg: message,
		});
	  }
  
	  // Si el token es válido, agregar los datos decodificados a la request
	  req.user = decoded.data;
  
	  // Continuar con el siguiente middleware o controlador
	  next();
	});
  };

  module.exports = {
	verificarToken
  };

 

 

