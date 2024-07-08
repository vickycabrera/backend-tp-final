const transport = require("../config/email.config.js")

class MailingRepository {
    async sendEmail(email, content) { //TO DO CAMBIAR NOMBRE DE FUNCION
        const {productosDisponibles, ticket} = content
        await transport.sendMail({
            from: "Coder tests <vlcabrera92@gmail.com>",
            to: email,
            subject: "Confirmación de compra",
            html: `
            <div style="font-family: Arial, sans-serif; margin: 0 auto; width: 80%; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="text-align: center; color: #333;">Confirmación de Compra</h1>
                <div style="margin-top: 20px;">
                    <p><strong>Usuario:</strong> ${email} </p>
                    <p><strong>Código de Ticket:</strong> ${ticket.code}</p>
                    <p><strong>Valor del Ticket:</strong> $${ticket.amount}</p>
                    <p><strong>Fecha y Hora de Compra:</strong> ${ticket.purchase_datetime}</p>
                    <p><strong>Productos Comprados:</strong></p>
                <ul>
                    ${productosDisponibles.map(p => `<li>${p.product.title} -  Valor: $${p.product.price} - Cantidad: ${p.quantity} </li>`).join('')}
                </ul>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <h2 style="color: #333;">¡Gracias por tu compra!</h2>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <h3 style="color: #333;">¡Te esperamos de vuelta pronto!</h3>
                </div>
            </div>
            `,
        })
    }
    async sendRestorePassword(email, first_name, token) {
        try {
            const mailOptions = {
                from: 'Coder tests <vlcabrera92@gmail.com>',
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await transport.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
    async sendInactivityDeletionEmails(users) {
        try {
            const promises = users.map(user => {
                const mailOptions = {
                    from: 'Coder tests <vlcabrera92@gmail.com>',
                    to: user.email,
                    subject: 'Cuenta eliminada por inactividad',
                    text: `Hola ${user.first_name},\n\nTu cuenta ha sido eliminada debido a la inactividad en los últimos dos días.\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEl equipo`
                };
                return transport.sendMail(mailOptions);
            });
            return await Promise.all(promises);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
    async sendProductHasBeenDeleted(product, email) {
        try {
            const mailOptions = {
                from: 'Coder tests <vlcabrera92@gmail.com>',
                to: email,
                subject: 'Producto eliminado',
                html: `
                <h1>Se ha eliminado tu producto del catalogo</h1>
                <p><strong>ID:</strong> ${product._id}</p>
                <p><strong>Titulo:</strong> ${product.title}</p>
                <p><strong>Descripcion:</strong> ${product.description}</p>
                <p><strong>Precio:</strong> ${product.price}</p>
            `
            };
            await transport.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
}

module.exports = MailingRepository;