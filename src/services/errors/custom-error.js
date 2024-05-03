

class CustomError extends Error {
    constructor({ name="Error", cause="Desconocido", code=1, message }) {
        super(message); // Llama al constructor de la clase base Error con el mensaje proporcionado
        this.name = name; // Establece el nombre del error
        this.cause = cause; // Establece la causa del error
        this.code = code; // Establece el código de error
        this.stack = ""
    }
}
module.exports = CustomError;