const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authMiddleware");
const userBookController = require("../controllers/userBookController.js");

router.post("/create", validateUserToken, userBookController.addUserBook);

router.get("/getAll", validateUserToken, userBookController.getAllUserBooks);

router.delete("/:id", validateUserToken, userBookController.deleteUserBookById);

module.exports = router;
