const express = require('express');
const { authMiddleware } = require('../../../utils/utils');
const { makeOrder, cancelOrder, getSingleOrder } = require('./customer.order.controller');
const customerOrderRouter = express.Router();



customerOrderRouter.post('/orders', authMiddleware('customer'), makeOrder);

customerOrderRouter.put('/orders/:orderId/cancel', authMiddleware('customer'), cancelOrder);
customerOrderRouter.get('/:orderId/', authMiddleware('customer'), getSingleOrder);
module.exports = customerOrderRouter;
