// validations.js

const validations = {
    // Validación para verificar si una cadena no está vacía
    validatePropsOfProduct: function(producto, propiedadesRequeridas) {
        // Iterar sobre las propiedades requeridas
        for (const propiedad in propiedadesRequeridas) {
            if (!producto.hasOwnProperty(propiedad)) {
                return false
            }

            const tipoEsperado = propiedadesRequeridas[propiedad];
            const valorRecibido = producto[propiedad];
            
            // Verificar el tipo de la propiedad
            if (typeof valorRecibido !== tipoEsperado) {
                return false
            }

            //Verificar si es un string y si esta vacío
            if (typeof valorRecibido === "string" && valorRecibido.length ===0) {
                return false
            }
            
        }

        // Si se pasaron todas las verificaciones, el producto es válido
        return true
    },
};

// Exportar el objeto de validaciones
module.exports = validations;