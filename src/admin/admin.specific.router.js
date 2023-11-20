const express = require('express');
const adminAccountRouter = require('./account/account.routes');
const productRouter = require('./product/product.routes');
const adminOrderRouter = require('./orders/admin.order.routes');

const adminSpecificRouter = express.Router();

adminSpecificRouter.use('/auth',adminAccountRouter);
adminSpecificRouter.use('/products',productRouter);
adminSpecificRouter.use('/order',adminOrderRouter);

module.exports = adminSpecificRouter;