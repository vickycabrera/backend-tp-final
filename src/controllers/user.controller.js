const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const CartRepository = require("../repositories/cart.repository.js")
const cartRepository = new CartRepository()
const generarUsuarios = require("../utils/generateUsers.js")

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await userRepository.findByEmail(email);
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe");
            }
            const nuevoCarrito = await cartRepository.crearCarrito()
            const user = {
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id, 
                password: createHash(password),
                age
            }
            const userCreated= await userRepository.createNewUser(user)

            const token = jwt.sign({ user: userCreated }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await userRepository.findByEmail(email);

            if (!user) {
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, user);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        res.render("admin");
    }
    async createManyUsers(req, res) {
        try {
            const MOCK_QUANTITY = 10;
            const users = generarUsuarios(MOCK_QUANTITY);        
            const usersWithCarts = await Promise.all( users.map(async u=>{
                const nuevoCarrito = await cartRepository.crearCarrito();
                return {
                    ...u,
                    cart: nuevoCarrito._id
                }
            }))
            const respuesta = await userRepository.createManyUsers(usersWithCarts);
            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al insertar muchos usuarios");
        }
    }
}

module.exports = UserController;
