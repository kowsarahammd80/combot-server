const User = require('../models/userModel.js')
const bcrypt = require("bcryptjs");

// exports.createUser = async (userData) => {
//     return await User.create(userData);
// };

exports.registerUserService = async (name, email, password, number, access) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, number, access, password: hashedPassword });
    await user.save();
  
    return user;
};

exports.loginUser = async (email, password, session) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
  
    session.userId = user._id;
    return user;
};

exports.logoutUser = (session) => {
    session.destroy();
};

exports.getAllUsers = async () => {
    return await User.find().sort({ date: -1 });
};

exports.getUserByIdService = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw new Error("User not found or invalid ID.");
    }
};
