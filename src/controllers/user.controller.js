const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const CartRepository = require("../repositories/cart.repository.js")
const cartRepository = new CartRepository()
const generarUsuarios = require("../utils/generateUsers.js")
const MailingRepository = require("../repositories/mailing.repository.js")
const mailingRepository = new MailingRepository()
const {generateResetToken} = require("../utils/tokenreset.js")

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
            const userFinded = await userRepository.findByEmail(email);

            if (!userFinded) {
                return res.status(401).send("Usuario no válido");
            }

            const areCredentialsValid = isValidPassword(password, userFinded);
            if (!areCredentialsValid) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: userFinded }, "coderhouse", {
                expiresIn: "1h"
            });
            //CUARTA INTEGRADORA.
            //Actualizar la propiedad last_connection
            userFinded.last_connection = new Date();
            await userFinded.save();
            
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
        const isPremium = req.user.role === 'premium';
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin, isPremium });
    }

    async logout(req, res) {
        if (req.user) {
            try {
                //CUARTA INTEGRADORA
                // Actualizar la propiedad last_connection
                req.user.last_connection = new Date();
                await req.user.save();
            } catch (error) {
                console.error(error);
                res.status(500).send("Error interno del servidor");
                return;
            }
        }

        res.clearCookie("coderCookieToken");
        res.redirect("/login")
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
    // Tercer integradora / Recuperar contrasena: 
    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Generar un token 
            const token = generateResetToken();

            // Guardar el token en el usuario
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
            await mailingRepository.sendRestorePassword(email, user.first_name, token);

            res.redirect("/confirmacion-envio");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }

            // Obtener el token de restablecimiento de la contraseña del usuario
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.redirect("/passwordcambio");
            }

            // Verificar si la nueva contraseña es igual a la anterior
            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizar la contraseña del usuario
            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save()

            // Renderizar la vista de confirmación de cambio de contraseña
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    async cambiarRolPremium(req, res) {
        const { uid } = req.params;
        try {
            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificamos si el usuario tiene la documentacion requerida: 
            const requiredDocuments = ["id", "address", "account-status"];     

            const userDocuments = user.documents.map(doc => doc.name.toLowerCase());
              
            const areAllRequiredDocumentsPresent = requiredDocuments.every(doc => userDocuments.some(file=>file.includes(doc)));

            if (!areAllRequiredDocumentsPresent) {
                // TO DO devolver error que especifique que documentacion falta
                return res.status(400).send("El usuario tiene que completar toda la documentacion requerida");
            }

            const newRole = user.role === 'usuario' ? 'premium' : 'usuario';

            const updatedUser = await userRepository.changeRole(uid, newRole);

            res.json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    
    async uploadDocuments(req, res){
        const { uid } = req.params;
        const uploadedDocuments = req.files;

        try {
            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }

                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }

                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
            }

            await user.save();
            res.status(200).send("Documentos cargados exitosamente");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error interno del servidor, los mosquitos seran cada vez mas grandes");
        }
            }

    async getUsers(req, res) {
        try {
            const allUsers = await userRepository.getUsers();

            res.json(allUsers);
        } catch (error) {
            res.status(500).send("Error");
        }
    }
    async deleteUserById(req, res) {
        try {
            const _id = req.uid
            
            await userRepository.deleteUserById(_id);

            res.status(200).json({
            message: "Usuario eliminado correctamente",
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
    async deleteInactiveUsers(req, res) {
        try {
            const twoDaysAgo = new Date()

            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

            const query = {last_connection: { $lt: twoDaysAgo }}

            const inactiveUsers = await userRepository.findManyUsers(query);

            const result = await userRepository.deleteUsers(query);

            await mailingRepository.sendInactivityDeletionEmails(inactiveUsers)

            res.status(200).json({
            message: "Usuarios inactivos eliminados correctamente",
            deletedCount: result.deletedCount,
            deletedUsers: inactiveUsers
        });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
    
}

module.exports = UserController;
