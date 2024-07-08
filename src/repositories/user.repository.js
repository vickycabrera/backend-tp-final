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
    async findManyUsers(filterQuery){
        try {
            return await UserModel.find(filterQuery)
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
    async getUsers(){
        try {
            return await UserModel.find()  
        } catch (error) {
            throw new Error("Error");
        }
    }
    async deleteUserById(id){
        try {
            return await UserModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error");
        }
    }
    async deleteUsers(filterQuery){
        try {
            return await UserModel.deleteMany(filterQuery)  
        } catch (error) {
            throw new Error("Error");
        }
    }
}

module.exports = UserRepository;
