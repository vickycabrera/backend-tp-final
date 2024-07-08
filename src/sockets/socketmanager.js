const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController(); 
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await productRepository.obtenerProductos() );

            socket.on("eliminarProducto", async (id) => {
                await productController.deleteProductAndSendEmail(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                try {
                    
                    await productRepository.agregarProducto(producto);
                    this.emitUpdatedProducts(socket);
                    socket.emit("productoAgregado", producto);
                } catch (error) {
                    socket.emit("error", error);
                }
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await productRepository.obtenerProductos());
    }
}

module.exports = SocketManager;
