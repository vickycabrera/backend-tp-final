// Middleware para bloquear acceso a la ruta 
// si no estás en entorno de desarrollo

const program = require("../utils/commander.js");

const {mode} = program.opts(); 

function restrictToDevelopment(req, res, next) {
    if (mode === 'produccion') {
        return res.status(403).send('Acceso prohibido en este entorno.');
    }
    next();
    }

module.exports = restrictToDevelopment