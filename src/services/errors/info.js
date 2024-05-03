function generarInfoError(parametrosEsperados, valoresRecibidos) {
    
    let infoError = "";
    for (const key in parametrosEsperados) {

        const parametro = key;
        const tipoEsperado = parametrosEsperados[key];
        const valorRecibido = valoresRecibidos[key]

        if (!valoresRecibidos.hasOwnProperty(key)) {
            infoError += `El producto no tiene la propiedad '${key}' requerida.`;
        } else if (typeof valorRecibido !== tipoEsperado) {
            infoError += `${parametro}: Se esperaba un ${tipoEsperado} pero se recibió ${typeof valorRecibido}\n`;
        } else if(typeof valorRecibido ==="string" && valorRecibido.length ===0 ){
            infoError += `${parametro}: Se recibió un string vacío \n`;
        }
    }

    return infoError;
}

module.exports = {
    generarInfoError
}