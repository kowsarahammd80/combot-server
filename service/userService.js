const User = require('../models/userModel.js')

exports.createUser = async (userData) => {
    return await User.create(userData);
};
  
exports.getAllUsers = async () => {
    return await User.find().sort({ date: -1 });
};