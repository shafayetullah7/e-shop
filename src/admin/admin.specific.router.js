const express = require('express');
const adminAccountRouter = require('./account/account.routes');

const adminSpecificRouter = express.Router();

adminSpecificRouter.use('/auth',adminAccountRouter);

module.exports = adminSpecificRouter;