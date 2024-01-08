const express = require("express");
const customerAccountRouter = require("./account/cuAccount.routes");
const cartRouter = require("./cart/cart.routes");
const customerOrderRouter = require("./orders/customer.order.routes");

const customerSpecificRouter = express.Router();
customerSpecificRouter.use("/auth", customerAccountRouter);
customerSpecificRouter.use("/cart", cartRouter);
customerSpecificRouter.use("/orders", customerOrderRouter);
module.exports = customerSpecificRouter;
