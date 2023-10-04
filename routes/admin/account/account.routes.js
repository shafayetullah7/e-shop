const express = require('express');
const { createAdmin, loginAdmin } = require('./account.controller');

const adminAccountRouter = express.Router();

adminAccountRouter.post('/create',createAdmin);
adminAccountRouter.post('/login',loginAdmin);

module.exports = adminAccountRouter;