const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }
    async findByCartId(cartId) {
        return UserModel.findOne({ cart: cartId });
    }
    async createNewUser(user){
        const usuario= new UserModel(user);
        return await usuario.save();
    }
    async changeRole(uid, nuevoRol){
        try {
            return await UserModel.findByIdAndUpdate(uid, { role: nuevoRol }, { new: true });
        } catch (error) {
            throw error;
        }
    }
    async createManyUsers(users){
        try {
            const result = await UserModel.insertMany(users);
            return result
        } catch (error) {
            console.log("error createManyUsers", error)
            throw new Error("Error");
        }
    }
}

module.exports = UserRepository;
