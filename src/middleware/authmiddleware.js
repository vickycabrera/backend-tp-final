const passport = require('passport');

function authMiddleware(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.user = null;
            return  res.render("unauthorized");
        } else {
            req.user = user;
            res.locals.isAuthenticated = true
            res.locals.userCart= user.cart
        }
        next();
    })(req, res, next);
}


module.exports = authMiddleware;
