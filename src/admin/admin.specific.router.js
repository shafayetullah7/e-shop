const express = require('express');
const adminAccountRouter = require('./account/account.routes');
const productRouter = require('./product/product.routes');

const adminSpecificRouter = express.Router();

adminSpecificRouter.use('/auth',adminAccountRouter);
adminSpecificRouter.use('/products',productRouter);

module.exports = adminSpecificRouter;