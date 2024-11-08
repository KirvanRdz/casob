const User = require('../models/users');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const config= require('../config/index');
const login = async (req, res, next) => {
	try {
		
		const emailLogin=req.body.email;
		const passwordLogin=req.body.password;
		if (!emailLogin || emailLogin==''||!passwordLogin || passwordLogin=='')return res.status(400).json({msg: 'datos en el body incorrectos', status:400});
		const dataUser = await User.findOneByEmail(emailLogin);
		
		if (!dataUser)return res.status(400).json({msg: 'El correo es incorrecto', status:400});
		if (dataUser=='ERROR')return res.status(400).json({msg: 'Error obteniendo usuario por correo', status:500});
		
		const password=dataUser.contraseña;
		const userId=dataUser.id
		
		if( !bcrypt.compareSync(passwordLogin, password)){

			return res.status(400).json({msg: 'La contraseña es incorrecta', status:400});
		}
		const data={
			userId,
			email:emailLogin,

		}
		//Generamos el token de autorizacíón

		let token  = jwt.sign({

			data

		},config.SECRET_TOKEN, { expiresIn: Number(config.CADUCIDAD_SESSION) })
		
		return res.status(200).json({userId,token,email:emailLogin, status:200});
	} catch (err) {
		console.log(err)
		next(err);
	}			
};
 
  module.exports = {login};