const express = require('express');
const { authMiddleware } = require('../../../utils/utils');
const { makeOrder, cancelOrder, getSingleOrder, getAllOrders } = require('./customer.order.controller');
const customerOrderRouter = express.Router();


customerOrderRouter.post('/', authMiddleware('customer'), makeOrder);
customerOrderRouter.get('/', authMiddleware('customer'), getAllOrders);
customerOrderRouter.put('/:orderId/cancel', authMiddleware('customer'), cancelOrder);
customerOrderRouter.get('/:orderId/', authMiddleware('customer'), getSingleOrder);


module.exports = customerOrderRouter;
