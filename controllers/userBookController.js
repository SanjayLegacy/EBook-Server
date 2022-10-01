const db = require("../models");
const asyncHandler = require("express-async-handler");

const UserBook = db.userBook;
const Transaction = db.transactions;
const Book = db.ebooks;
const User = db.users;

const addUserBook = asyncHandler(async (req, res) => {
  const { bookId, noOfDays } = req.body;

  if (noOfDays <= 0) {
    res.status(400);
    throw new Error("Rent days must be equal to or greater than 1");
  }

  const alreadyExists = await UserBook.findOne({
    where: { bookId: bookId, userId: req.user.id },
  });

  if (alreadyExists) {
    res.status(400);
    throw new Error("Already available in your books");
  }

  const addDays = (days) => {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const startDate = new Date().toISOString();

  const endDate = addDays(noOfDays).toISOString();

  const bookToRent = await Book.findOne({ where: { id: bookId } });

  const amountToBeDeducted = bookToRent.rent * parseInt(noOfDays);

  const currentUser = await User.findOne({ where: { id: req.user.id } });

  if (currentUser.walletBalance > amountToBeDeducted) {
    await User.update(
      {
        walletBalance: currentUser.walletBalance - amountToBeDeducted,
      },
      { where: { id: req.user.id } }
    );

    await Transaction.create({
      userId: req.user.id,
      amount: amountToBeDeducted,
    });

    await UserBook.create({
      startDate,
      userId: req.user.id,
      endDate,
      bookId,
    });

    res.status(200).send("Success");
  } else {
    res.status(400).send("Low wallet balance!");
  }
});

const getAllUserBooks = asyncHandler(async (req, res) => {
  const userBooks = await UserBook.findAll({ where: { userId: req.user.id } });

  res.status(200).send(userBooks);
});

const deleteUserBookById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("bookId cannot be empty !");
  }

  await UserBook.destroy({ where: { userId: req.user.id, bookId: id } });

  res.status(200).send({ message: "Deleted Successfully !" });
});

module.exports = {
  addUserBook,
  getAllUserBooks,
  deleteUserBookById,
};
