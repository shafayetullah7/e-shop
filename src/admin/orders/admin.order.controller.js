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
    if (order.status !== "pending") {
      return res
        .status(400)
        .send({ error: true, message: `Order is already ${order.status}` });
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
const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the provided orderId is valid
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status !== "pending") {
      return res
        .status(400)
        .send({ error: true, message: `Order is already ${order.status}` });
    }

    // Update the status of the order to 'cancelled'
    order.status = "rejected";
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrders = async (req, res) => {
  try {
    // Find all orders with the status 'pending'
    const status = req.query.status || "pending";
    const pendingOrders = await Order.find({ status })
      .populate("customer")
      .populate("cart");

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
    const order = await Order.findById(orderId)
      .populate("customer")
      .populate("cart");

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
  rejectOrder,
  getOrders,
  getSingleOrder,
};
