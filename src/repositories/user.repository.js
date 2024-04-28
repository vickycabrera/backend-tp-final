const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
    async findByCartId(cartId) {
        return UserModel.findOne({ cart: cartId });
    }
    async createNewUser(user){
        const usuario= new UserModel(user);
        return await usuario.save();
    }
}

module.exports = UserRepository;
