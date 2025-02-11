const userService = require('../service/userService.js')

exports.createUserController = async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
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