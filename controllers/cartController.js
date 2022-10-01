const db = require("../models");
const asyncHandler = require("express-async-handler");

const Cart = db.cart;
const Book = db.ebooks;
const CartItem = db.cartItems;

const initCart = async (userId) => {
  const cartExists = await Cart.findOne({ where: { userId: userId } });

  if (!cartExists) {
    return await Cart.create({ userId });
  }

  return cartExists;
};

const createCart = asyncHandler(async (req, res) => {
  return await initCart(req.user.id)
    .then((cart) => {
      return res.status(200).send(cart);
    })
    .catch((err) => {
      res.status(400);
      throw new Error(`Cannot create cart ${err}`);
    });
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    res.status(400);
    throw new Error("Cart is not initialized for this user");
  }

  const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

  const cartToSend = {
    userId: cart.userId,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    id: cart.id,
    items: cartItems ? cartItems : [],
  };

  res.status(200).send(cartToSend);
});

const addToCart = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const bookExists = await Book.findOne({ where: { id: id } });
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!bookExists) {
    res.status(400);
    throw new Error(`Book cannot be found for id: ${id}`);
  }

  const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

  const bookAlreadyInCart = cartItems.find((item) => item.itemId === id);

  if (bookAlreadyInCart) {
    res.status(400);
    throw new Error("Book already added in Cart");
  }
  console.log("id====>", id, cart.id);
  const cartItem = await CartItem.create({ itemId: id, cartId: cart.id });

  return res.status(200).send(cartItem);
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

  const itemInCart = await cartItems.find((item) => item.itemId === id);

  if (!itemInCart) {
    res.status(400);
    throw new Error("Item Not in Cart");
  }

  await CartItem.destroy({ where: { itemId: id, cartId: cart.id } });

  return res
    .status(200)
    .send({ message: `Removed item ${id} from ${cart.id}` });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { noOfDays } = req.body;

  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

  const itemInCart = await cartItems.find((item) => item.itemId === id);

  if (!itemInCart) {
    res.status(400);
    throw new Error("Item Not in Cart");
  }

  await CartItem.update(
    {
      noOfDays: noOfDays,
    },
    { where: { cartId: cart.id, itemId: id } }
  );
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  await CartItem.destroy({ where: { cartId: cart.id } });

  return res.status(200).send(`Cart cleared for user ${req.user.id}`);
});

module.exports = {
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeItemFromCart,
  initCart,
  clearCart,
};
