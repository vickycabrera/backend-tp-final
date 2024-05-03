const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const authMiddleware = require("../middleware/authmiddleware.js");

router.get("/products", checkUserRole(['usuario']), authMiddleware, viewsController.renderProducts);

router.get("/carts/:cid", authMiddleware, viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin']), authMiddleware,viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario']),authMiddleware,viewsController.renderChat);
router.get("/", viewsController.renderHome);

module.exports = router;

