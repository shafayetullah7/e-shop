const express = require('express');
const adminAccountRouter = require('./account/account.routes');

const adminSpecificRouter = express.Router();

adminSpecificRouter.use('/account',adminAccountRouter);

module.exports = adminSpecificRouter;