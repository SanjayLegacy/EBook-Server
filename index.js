const express = require("express");
const cors = require("cors");
const app = express();
const helmet = require("helmet");

app.use(express.json());
app.use(cors());
app.use(helmet());

const db = require("./models");

const usersRouter = require("./routes/User_Routes");
app.use("/auth", usersRouter);

const bookRouter = require("./routes/Book_Routes");
app.use("/ebook", bookRouter);

const userBookRouter = require("./routes/UserBook_Routes");
app.use("/userBook", userBookRouter);

const cartRouter = require("./routes/Cart_Routes");
app.use("/cart", cartRouter);

const transactionRouter = require("./routes/Transaction_Routes");
app.use("/ledger", transactionRouter);

db.sequelize.sync().then(() => {
  app.listen(3002, () => {
    console.log("<--- EBook Server Connected --->");
  });
});
