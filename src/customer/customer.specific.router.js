const express = require("express");
const customerAccountRouter = require("./account/cuAccount.routes");

const customerSpecificRouter = express.Router();
customerSpecificRouter.use("/auth", customerAccountRouter);
module.exports = customerSpecificRouter;