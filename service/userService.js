const User = require('../models/userModel.js')
const bcrypt = require("bcryptjs");

// exports.createUser = async (userData) => {
//     return await User.create(userData);
// };

exports.registerUserService = async (name, email, password, number, access, createBy, createDate, updateBy, updateDate,) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, number, access, createBy, createDate, updateBy, updateDate,password: hashedPassword });
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

// exports.updateUser = async (userId, { name, number, access, newPassword }) => { 
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new Error("User not found");
//     }

//     // Update name and number if provided
//     if (name) user.name = name;
//     if (number) user.number = number;

//     // Update access level if provided
//     if (access) user.access = access;

//     // Update password if a new one is provided and not empty
//     if (newPassword && newPassword.trim() !== "") {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);
//     }

//     await user.save();
//     return {
//         _id: user._id,
//         name: user.name,
//         number: user.number,
//         access: user.access,
//     };
// };

exports.updateUser = async (userId, { name, number, newPassword, updateBy, updateDate, access }) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Update fields if provided
    if (name) user.name = name;
    if (number) user.number = number;

    if (access) user.access = access;

    // Update password only if a new password is provided
    if (newPassword && newPassword.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update who is modifying the user and the update timestamp
    if (updateBy) user.updateBy = updateBy;
    if (updateDate) user.updateDate = updateDate;

    await user.save(); // Save changes to the database

    return {
        _id: user._id,
        name: user.name,
        access: user.access,
        number: user.number,
        updateBy: user.updateBy,
        updateDate: user.updateDate,
    };
};

exports.deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};
// exports.updateUser = async (userId, { name, number, access, newPassword}) => {
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new Error("User not found");
//     }

//     // Update name and number
//     if (name) user.name = name;
//     if (number) user.number = number;

//     // Update access level (Password remains unchanged)
//     if (access) {
//         user.access = access;
//     }

//     // If new password is provided, update password with hashing
//     if (newPassword) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);
//     }

//     await user.save();
//     return user;
// };