const jwt = require('jsonwebtoken');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (token) {
        console.log("token",token)
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            if (err) {
                res.status(403).send('Acceso denegado. Token inválido.');
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.render("unauthorized")
                }
            }
        });
    } else {
        res.status(403).send('Acceso denegado. Token no proporcionado.');
    }
};

module.exports = checkUserRole;