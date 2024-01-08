const express = require("express");
const {
  addToCart,
  updateCart,
  removeFromCart,
  getAllItemsInCart,
} = require("./cart.controller");
const { authMiddleware } = require("../../../utils/utils");

const cartRouter = express.Router();

cartRouter.post("/", authMiddleware("customer"), addToCart);
// cartRouter.put("/update", authMiddleware("customer"), updateCart);
cartRouter.delete("/:productId", authMiddleware("customer"), removeFromCart);
cartRouter.get("/", authMiddleware("customer"), getAllItemsInCart);

module.exports = cartRouter;
