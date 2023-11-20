const express = require('express');
const { authMiddleware } = require('../../../utils/utils');
const { serveOrder, cancelOrder, getPendingOrders, getSingleOrder } = require('./admin.order.controller');
const adminOrderRouter = express.Router();


adminOrderRouter.put('/orders/:orderId/serve', authMiddleware('admin'),serveOrder);

adminOrderRouter.put('/orders/:orderId/cancel', authMiddleware('admin'),cancelOrder);
adminOrderRouter.get('/',authMiddleware('admin'),getPendingOrders);
adminOrderRouter.get('/:orderId',authMiddleware('admin'),getSingleOrder);

module.exports = adminOrderRouter;
