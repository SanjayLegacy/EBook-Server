const db = require("../models");
const asyncHandler = require("express-async-handler");
const { Op, or } = require("sequelize");
const { sequelize } = require("../models");

const EBooks = db.ebooks;

const getAllBooks = asyncHandler(async (req, res) => {
  const listOfEBooks = await EBooks.findAll();
  res.status(200).json(listOfEBooks);
});

const getBookById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const book = await EBooks.findOne({ where: { id: id } });

  if (!book) {
    res.status(400);
    throw new Error(`Book not found = ${id}`);
  }

  res.status(200).send(book);
});

const addNewBook = asyncHandler(async (req, res) => {
  const {
    author,
    imageLink,
    shortDescription,
    longDescription,
    pageCount,
    title,
    publishedYear,
    rent,
    genre,
  } = req.body;
  const book = await EBooks.findOne({ where: { title: title } });

  if (book) {
    res.status(400).json({ error: "Book already exist!" });
  } else {
    await EBooks.create({
      author: author,
      imageLink: imageLink,
      longDescription: longDescription,
      shortDescription: shortDescription,
      pageCount: pageCount,
      title: title,
      publishedYear: publishedYear,
      rent: rent,
      genre: genre,
    });
    res.status(200).json("Book Added Successfully!");
  }
});

const updateBook = asyncHandler(async (req, res) => {
  const { author, imageLink, bookInfo, pageCount, title, publishedYear, rent } =
    req.body;
  const bookId = req.params.id;
  const book = await EBooks.findOne({ where: { id: bookId } });

  if (book) {
    await EBooks.update(
      {
        author: author,
        imageLink: imageLink,
        bookInfo: bookInfo,
        pageCount: pageCount,
        title: title,
        publishedYear: publishedYear,
        rent: rent,
      },
      { where: { title: title } }
    );
    res.status(200).json("Book Updated Successfully!");
  }
});

const getBooksByFilter = asyncHandler(async (req, res) => {
  const { searchText } = req.body;

  if (!searchText) {
    res.status(400);
    throw new Error("Search text cannot be Empty !");
  }

  const books = await EBooks.findAll({
    where: {
      [Op.or]: [
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("title")),
          "LIKE",
          "%" + searchText + "%"
        ),
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("genre")),
          "LIKE",
          "%" + searchText + "%"
        ),
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("author")),
          "LIKE",
          "%" + searchText + "%"
        ),
      ],
    },
  });

  res.status(200).send(books);
});

const deleteBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  await EBooks.destroy({ where: { id: bookId } });
  res.status(200).json("Book Deleted Successfully");
});

module.exports = {
  getAllBooks,
  getBookById,
  addNewBook,
  updateBook,
  getBooksByFilter,
  deleteBook,
};
