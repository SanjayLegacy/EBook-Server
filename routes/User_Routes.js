const express = require("express");
const router = express.Router();
const {
  validateUserToken,
  validateAdminToken,
} = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.get("/getUserById/:id", validateAdminToken, userController.getUserById);

router.get("/getAllUsers", validateAdminToken, userController.getAllUsers);

router.post("/register", userController.registerUser);

router.get("/currentUser", validateUserToken, userController.getCurrentUser);

router.put("/update", validateUserToken, userController.updateUser);

router.delete("/delete/:id", validateAdminToken, userController.deleteUser);

router.post("/login", userController.userLogin);

module.exports = router;
