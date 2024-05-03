
const EErrors = require('../services/errors/enums.js');

const manejadorError = (error, req, res, next) => {
    console.log("manejadorError", error.cause); 
    // Suponiendo que 'causa' es una propiedad del objeto 'error' que contiene información adicional sobre el error
    switch(error.code) {
        case EErrors.RUTA_ERROR:
            res.status(404).send({status: "error", error: "La ruta solicitada no existe"});
            break;
        case EErrors.TIPO_INVALIDO:
            res.status(400).send({status: "error", error: "El tipo de solicitud es inválido"});
            break;
        case EErrors.BD_ERROR:
            res.status(500).send({status: "error", error: "Error interno de la base de datos"});
            break;
        case EErrors.AUTENTICACION_ERROR:
            res.status(401).send({status: "error", error: "Error de autenticación"});
            break;
        case EErrors.VALIDACION_DATOS_ERROR:
            res.status(422).send({status: "error", error: "Error de validación de datos"});
            break;
        case EErrors.CONEXION_ERROR:
            res.status(503).send({status: "error", error: "Error de conexión"});
            break;
        case EErrors.PROCESAMIENTO_PAGO_ERROR:
            res.status(402).send({status: "error", error: "Error al procesar el pago"});
            break;
        case EErrors.INVENTARIO_ERROR:
            res.status(409).send({status: "error", error: "Error de inventario"});
            break;
        case EErrors.CARGA_IMAGEN_ERROR:
            res.status(500).send({status: "error", error: "Error al cargar la imagen"});
            break;
        case EErrors.BUSQUEDA_ERROR:
            res.status(404).send({status: "error", error: "No se encontraron resultados"});
            break;
        case EErrors.CONFIGURACION_ERROR:
            res.status(500).send({status: "error", error: "Error de configuración"});
            break;
        case EErrors.SEGURIDAD_ERROR:
            res.status(403).send({status: "error", error: "Error de seguridad"});
            break;
        case EErrors.RENDIMIENTO_ERROR:
            res.status(500).send({status: "error", error: "Error de rendimiento"});
            break;
        default:
            res.status(500).send({status: "error", error: "Error desconocido"}); // Manejo para otros tipos de error no especificados
    }
}

module.exports = manejadorError;