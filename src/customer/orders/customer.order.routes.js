const express = require('express');
const { authMiddleware } = require('../../../utils/utils');
const { makeOrder, cancelOrder } = require('./customer.order.controller');
const customerOrderRouter = express.Router();



customerOrderRouter.post('/orders', authMiddleware('customer'), makeOrder);

customerOrderRouter.put('/orders/:orderId/cancel', authMiddleware('customer'), cancelOrder);

module.exports = customerOrderRouter;
