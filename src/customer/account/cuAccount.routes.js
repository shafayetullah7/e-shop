const express = require('express');
const { createCustomer, addToCart, updateCart } = require('./cusAccount.controller');

const customerAccountRouter = express.Router();
customerAccountRouter.post("/create", createCustomer);
customerAccountRouter.post("/add", addToCart);
customerAccountRouter.put("/update", updateCart);
module.exports = customerAccountRouter;