const express = require('express');
const { authMiddleware } = require('../../../utils/utils');
const { serveOrder, getSingleOrder, getOrders, rejectOrder } = require('./admin.order.controller');
const adminOrderRouter = express.Router();


adminOrderRouter.patch('/:orderId/serve', authMiddleware('admin'),serveOrder);
adminOrderRouter.patch('/:orderId/reject', authMiddleware('admin'),rejectOrder);
adminOrderRouter.get('/',authMiddleware('admin'),getOrders);
adminOrderRouter.get('/:orderId',authMiddleware('admin'),getSingleOrder);

module.exports = adminOrderRouter;
