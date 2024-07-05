const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const TicketRepository = require("../repositories/tickets.repository.js");
const ticketRepository = new TicketRepository();
const MailingRepository = require("../repositories/mailing.repository.js");
const mailingRepository = new MailingRepository();


class CartController {
    async nuevoCarrito(req, res) {
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.obtenerProductosDeCarrito(carritoId);
            if (!productos) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async agregarProductoEnCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = Number(req.body.quantity) || 1;
        console.log("agregarProductoEnCarrito",quantity, typeof quantity)
        try {
            //Tercer Integradora: 
            // Buscar el producto para verificar el propietario
            const producto = await productRepository.obtenerProductoPorId(productId);

            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Verificar si el usuario es premium y si es propietario del producto
            if (req.user.role === 'premium' && producto.owner === req.user.email) {
                return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
            }
            ////////////////////////////////////////////////////////////////////
            await cartRepository.agregarProducto(cartId, productId, quantity);
            const carritoID = (req.user.cart).toString();

            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        // Debes enviar un arreglo de productos en el cuerpo de la solicitud
        try {
            const updatedCart = await cartRepository.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarCantidad(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.actualizarCantidadesEnCarrito(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.vaciarCarrito(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;
            const productosNoDisponibles = [];
            const productosDisponibles = []
            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity
                    await productRepository.actualizarProducto(product._id, product)
                    productosDisponibles.push(item)
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                } else productosNoDisponibles.push(item);
            }
            const userWithCart = await userRepository.findByCartId(cartId)
            // Si hay productos para comprar,
            // crear un ticket con los datos de la compra
            if (productosDisponibles.length > 0) {
                const ticket =  await ticketRepository.createTicket(userWithCart._id, productosDisponibles)
                // Guardar el carrito actualizado en la base de datos
                await cartRepository.actualizarProductosEnCarrito(cartId, productosNoDisponibles)
                //Enviar mail con datos de compra
                await mailingRepository.sendEmail(userWithCart.email, {productosDisponibles, ticket})
                return res.status(200).json({ message: "Compra confirmada", productosNoDisponibles });
            }   
            res.status(200).json({message: "Error: ninguno de los productos tenía stock", productosNoDisponibles})
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

module.exports = CartController;

