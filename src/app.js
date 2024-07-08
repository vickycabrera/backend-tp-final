const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require('path');
const PUERTO = 8080;
require("./database.js");
const restrictToDevelopment = require("./middleware/restrictToDevelopment.js");
const ProductController = require("./controllers/product.controller.js")
const productController = new ProductController(); 
const UserController = require("./controllers/user.controller.js");
const userController = new UserController(); 
const manejadorError = require("./middleware/error.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("./src/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
//Passport 
app.use(passport.initialize()); 
initializePassport();
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.isAuthenticated =false
    next();
});

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

//DEV
app.get("/mockingproducts", restrictToDevelopment, productController.insertManyProducts)
app.get("/mockingusers", restrictToDevelopment, userController.createManyUsers)
//app.use(manejadorError);
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets: 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);

//SWAGGER: 
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

// Creamos un objeto de configuración: swaggerOptions
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion de la App Tienda Marolio",
            description: "E-commerce"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

// Conectamos Swagger a nuestro servidor de Express
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
