const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const UserDTO = require('../dto/user.dto.js');

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;

            const skip = (page - 1) * limit;

            const productos = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;


            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest }; // Agregar el ID al objeto
            });


            const cartId = req.user.cart.toString();

            res.render("products", {
                productos: nuevoArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

            if (!carrito) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            let totalCompra = 0;

            const productosEnCarrito = carrito.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                
                totalCompra += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        const usuario = req.user; 
        try {
            res.render("realtimeproducts", {role: usuario.role, email: usuario.email});
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
    //Tercer integradora: 
    async renderResetPassword(req, res) {
        res.render("passwordreset");
    }

    async renderCambioPassword(req, res) {
        res.render("passwordcambio");
    }

    async renderConfirmacion(req, res) {
        res.render("confirmacion-envio");
    }

    async renderPremium(req, res) {
        //TO DO agregar userProducts / PRODUCTOS QUE TENGAN COMO OWNER EL MISMO MAIL QUE EL USUARIO
        res.render("panel-premium");
    }
    async renderUsers(req, res){
        try {
            const users = await userRepository.getUsers()

            const nuevoArray = users.map(u => {
                const { _id, ...rest } = u.toObject();
                return { id: _id, isPremium: u.role === "premium", ...rest }; // Agregar el ID al objeto
            });

            res.render("panel-admin", {users:nuevoArray} )
        } catch (error) {
            console.error("Error al obtener usuarios", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }
}

module.exports = ViewsController;
