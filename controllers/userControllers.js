const userService = require('../service/userService.js')

// exports.createUserController = async (req, res) => {
//     try {
//       const user = await userService.createUser(req.body);
//       res.status(201).json({ message: "User created successfully", user });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };

exports.registerController = async (req, res) => {
  try {
    const { name, email, number, access, password } = req.body;
    const user = await userService.registerUserService(name, email, password, number, access);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password, req.session);
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logoutContorller = async (req, res) => {
  try {
    userService.logoutUser(req.session);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  
exports.getCurrentUser = async (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.status(200).json({ loggedIn: false });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getUserByIdContorller = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await userService.getUserByIdService(id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};