const db = require("../models");
const bcrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { initCart } = require("./cartController");

const Users = db.users;

const generateToken = (id, username) => {
  return jwtToken.sign({ username, id }, "abc123", { expiresIn: "1d" });
};

const getAllUsers = asyncHandler(async (req, res) => {
  const listOfUsers = await Users.findAll({where: {role: "User"}});
  res.status(200).json(listOfUsers);
});

const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await Users.findOne({ where: { id: id } });

  if (!user) {
    res.status(400);
    throw new Error(`User not found = ${id}`);
  }

  res.status(200).send(user);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, password, role } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  if (user) {
    res.status(400).json({ error: "User already exist!" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await Users.create({
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: hashPassword,
    role: role,
  });

  if (newUser) {
    await initCart(newUser.id);
    res.status(200).json("User Registered Successfully!");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.status(400).json({ error: "User doesn't exist!" });
    return;
  } else {
    await bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.status(400).json({
          error: "The Password you have entered is wrong.....Try again!",
        });
        return;
      }
      res.status(200).json({
        username: user.username,
        jwtToken: generateToken({ username: user.username, id: user.id }),
      });
      return;
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, password, role, walletBalance } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  if (user) {
    await bcrypt.hash(password, 10).then((hashPassword) => {
      Users.update(
        {
          username: username,
          firstName: firstName,
          lastName: lastName,
          password: hashPassword,
          role: role,
          walletBalance: walletBalance,
        },
        { where: { username: username } }
      );
      res.status(200).json("Updated Successfully!");
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  await Users.destroy({ where: { id: userId } });
  res.status(200).json("Deleted Successfully");
});

module.exports = {
  getUserById,
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
  userLogin,
  getCurrentUser,
};
