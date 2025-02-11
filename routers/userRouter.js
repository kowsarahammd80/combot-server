const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers.js");

router.post("/createUsers", userController.createUserController); // Create user
router.get("/users", userController.getAllUsers); // Get all users

module.exports = router;