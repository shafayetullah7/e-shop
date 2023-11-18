const express = require('express');
const { createCustomer } = require('./cusAccount.controller');

const customerAccountRouter = express.Router();
customerAccountRouter.post("/create", createCustomer);
module.exports = customerAccountRouter;