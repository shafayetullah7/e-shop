const Order = require("../../../model/Order");
const Cart = require("../../../model/customer/Cart");

const serveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the provided orderId is valid
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the status of the order to 'served'
    order.status = "served";
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to cancel an order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the provided orderId is valid
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the status of the order to 'cancelled'
    order.status = "cancelled";
    await order.save();

    // Update the status of the associated cart to 'active'
    const cart = await Cart.findById(order.cart);
    if (cart) {
      cart.status = "active";
      await cart.save();
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPendingOrders = async (req, res) => {
  try {
    // Find all orders with the status 'pending'
    const pendingOrders = await Order.find({ status: "pending" });

    res.json(pendingOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  serveOrder,
  cancelOrder,
  getPendingOrders,
  getSingleOrder
};
