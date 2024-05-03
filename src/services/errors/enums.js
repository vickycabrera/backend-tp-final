const EErrors = {
    RUTA_ERROR: 1, // Error relacionado con la ruta o URL
    TIPO_INVALIDO: 2, // Error de tipo inválido
    BD_ERROR: 3, // Error de base de datos
    AUTENTICACION_ERROR: 4, // Error de autenticación
    VALIDACION_DATOS_ERROR: 5, // Error de validación de datos
    CONEXION_ERROR: 6, // Error de conexión
    PROCESAMIENTO_PAGO_ERROR: 7, // Error de procesamiento de pago
    INVENTARIO_ERROR: 8, // Error de inventario
    CARGA_IMAGEN_ERROR: 9, // Error de carga de imagen
    BUSQUEDA_ERROR: 10, // Error de búsqueda
    CONFIGURACION_ERROR: 11, // Error de configuración
    SEGURIDAD_ERROR: 12, // Error de seguridad
    RENDIMIENTO_ERROR: 13, // Error de rendimiento
    PRODUCTO_CODIGO_REPETIDO: 14 // Error en creación de producto, code repetido
}

module.exports = EErrors;

