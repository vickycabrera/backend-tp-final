const {faker} = require("@faker-js/faker")

const generarProductos = (quantity) => {
    const products = []
    for (let index = 0; index < quantity; index++) {
        products.push({
            id: faker.database.mongodbObjectId(), 
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            img: faker.image.url(),
            price: faker.commerce.price(),
            stock: parseInt(faker.string.numeric()), 
            code: faker.commerce.isbn(13),
            category: faker.commerce.department(),
            status: true,
            thumbnails: []
        })
    }
    return products
}

module.exports = generarProductos 