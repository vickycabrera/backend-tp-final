const generarProductos = require("../utils/generateProducts.js")
//TODO : ELIMINAR
class MockController {
    async generateMockProducts(req, res) {
        console.log("generateMockProducts")
        try {
            const MOCK_QUANTITY = 50
            const products = generarProductos(MOCK_QUANTITY)
            res.json(products)
        } catch (error) {
            console.log("hubo un error al generar los productos",error)
            res.send({error: "error al generar productos"})
        }
    }
}

module.exports = MockController;