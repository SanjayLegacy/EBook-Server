const express = require("express");
const router = express.Router();
const {
  validateUserToken,
  validateAdminToken,
} = require("../middlewares/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.get(
  "/getAllTransactions",
  validateAdminToken,
  transactionController.getAllTransactions
);

router.get(
  "/getAllTransactionsByUser",
  validateUserToken,
  transactionController.getAllTransactionsByUser
);

module.exports = router;
