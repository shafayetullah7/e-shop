const express = require("express");
const {
  createCustomer,
  addToCart,
  updateCart,
  customerLogin,
} = require("./cusAccount.controller");

const customerAccountRouter = express.Router();
customerAccountRouter.post("/create", createCustomer);
customerAccountRouter.post("/login", customerLogin);
module.exports = customerAccountRouter;
