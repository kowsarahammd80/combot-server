const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers.js");


router.post("/register", userController.registerController);
router.post("/login", userController.loginController);
router.post("/logout", userController.logoutContorller);
router.get("/current-user", userController.getCurrentUser);
router.get("/getAll-users", userController.getAllUsers); 
router.get("/getAll-users/:id", userController.getUserByIdContorller); 

// router.post("/createUsers", userController.createUserController); 

module.exports = router;