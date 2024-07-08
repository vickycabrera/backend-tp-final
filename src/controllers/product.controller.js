const MailingRepository = require("../repositories/mailing.repository.js");
const mailingRepository = new MailingRepository()
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const generarProductos = require("../utils/generateProducts.js")

class ProductController {

    async addProduct(req, res) {
        const nuevoProducto = req.body;
        try {
            const resultado = await productRepository.agregarProducto(nuevoProducto);
            res.json(resultado);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const productos = await productRepository.obtenerProductos(limit, page, sort, query);
            res.json(productos);
        } catch (error) { 
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const buscado = await productRepository.obtenerProductoPorId(id);
            if (!buscado) {
                return res.json({
                    error: "Producto no encontrado"
                });
            }
            res.json(buscado);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;

            const resultado = await productRepository.actualizarProducto(id, productoActualizado);
            res.json(resultado);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProductAndSendEmail(id) {
        try {
            const prod = await productRepository.obtenerProductoPorId(id)

            const productHasOwner = prod.owner !== 'admin'

            if (productHasOwner){
                await mailingRepository.sendProductHasBeenDeleted(prod, prod.owner)
            }
            
            await productRepository.eliminarProducto(id);
        } catch (error) {
            throw new Error("Error");
        }
    }
    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let respuesta = await productRepository.eliminarProducto(id);

            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
    async insertManyProducts(req, res) {
        try {
            const MOCK_QUANTITY = 50
            const products = generarProductos(MOCK_QUANTITY)
            let respuesta = await productRepository.crearMuchosProductos(products);
            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al insertar muchos productos");
        }
    }
}

module.exports = ProductController; 