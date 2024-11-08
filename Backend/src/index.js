
const server = require('./services/server');
const config = require('./config/index')
const { initDb } = require('./db/connection');
const init = async () => {
	
	initDb().catch(err => console.error("Error inicializando DB:", err));
	server.listen(config.PORT , ()=> console.log("READY localhost:"+config.PORT))
}

init();