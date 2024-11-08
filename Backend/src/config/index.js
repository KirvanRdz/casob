const dotenv= require('dotenv') ;

dotenv.config();

const varEnv= {
  PORT: process.env.PORT || '8080',
  DB_USER:process.env.DB_USER,
  DB_HOST:process.env.DB_HOST,
  DB_NAME:process.env.DB_NAME,
  DB_PASSWORD:process.env.DB_PASSWORD,
  CADUCIDAD_SESSION:process.env.CADUCIDAD_SESSION,
  SECRET_TOKEN:process.env.SECRET_TOKEN
};

module.exports=varEnv;