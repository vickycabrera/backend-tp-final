const express = require("express");
const router = express.Router();
//const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const authMiddleware = require("../middleware/authmiddleware.js");
const checkUserRole = require("../middleware/checkrole.js");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile",authMiddleware, userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/logout", userController.logout.bind(userController));
router.get("/admin", checkUserRole(['admin']), authMiddleware, userController.admin);

//Tercer integradora: 
router.post("/requestPasswordReset", userController.requestPasswordReset); 
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.cambiarRolPremium);

//Cuarta integradora: 
//Vamos a crear un middleware para Multer y lo vamos a importar: 
const upload = require("../middleware/multer.js")
router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), userController.uploadDocuments)

module.exports = router;

