const {faker} = require("@faker-js/faker")
const { createHash } = require("./hashbcryp")
const generarProductos = require('./generateProducts');

//Necesito los ids de los carritos para poder asignarle al usuario
const generarUsuarios = (quantity) => {
    const usuarios = []
    for (let index = 0; index < quantity; index++) {
        usuarios.push({
            id: faker.database.mongodbObjectId(), 
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: createHash(faker.internet.password()),
            age: 10,
            role: "usuario"
        })
    }
    return usuarios
}

module.exports = generarUsuarios 