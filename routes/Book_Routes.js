const express = require("express");
const router = express.Router();
const {
  validateUserToken,
  validateAdminToken,
} = require("../middlewares/authMiddleware");
const bookController = require("../controllers/bookController");

router.get("/getAllEBooks", validateUserToken, bookController.getAllBooks);

router.get("/getBookById/:id", validateUserToken, bookController.getBookById);

router.post("/addNewBook", validateAdminToken, bookController.addNewBook);

router.put("/updateBook/:id", validateAdminToken, bookController.updateBook);

router.put("/filterBooks", validateUserToken, bookController.getBooksByFilter);

router.delete("/deleteBook/:id", validateAdminToken, bookController.deleteBook);

module.exports = router;
