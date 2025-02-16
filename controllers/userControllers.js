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
    const { name, email, number, access, createBy, createDate, updateBy, updateDate, password } = req.body;
    const user = await userService.registerUserService(name, email, password, number, access, createBy, createDate, updateBy,updateDate);
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

// exports.updateUser = async (req, res) => {
//   try {
//       const { userId } = req.params;
//       const { name, number, access, newPassword } = req.body;

//       const updatedUser = await userService.updateUser(userId, { name, number, access, newPassword });

//       res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//       res.status(400).json({ message: error.message });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { name, number, access, newPassword, updateBy} = req.body;
//     // const updatedBy = req.user.name;  // Assuming `req.user.name` contains the name of the user performing the update

//     const updatedUser = await userService.updateUser(userId, { name, number, access, newPassword, updateBy});

//     res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.updateUser = async (req, res) => {
  try {
      const { userId } = req.params;
      const { name, number, newPassword, updateBy, updateDate, access } = req.body;

      const updatedUser = await userService.updateUser(userId, { name, number, newPassword, updateBy, updateDate, access});

      res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
      const { userId } = req.params; // Get userId from request params
      const deletedUser = await userService.deleteUser(userId); // Call the service to delete user
      res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};
// exports.updateUser = async (req, res) => {
//   try {
//       const { userId } = req.params;
//       const { name, number, access, newPassword } = req.body;

//       const updatedUser = await userService.updateUser(userId, { name, number, access, newPassword });
//       res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//       res.status(400).json({ message: error.message });
//   }
// };