const Order = require("../../../model/Order");
const Cart = require("../../../model/customer/Cart");
const Customer = require("../../../model/customer/Customer");

// Controller to make a new order

const makeOrder = async (req, res) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    const customer = await Customer.findOne({ email });
    // Find the user's cart with an "active" status
    const cart = await Cart.findOne({ email, status: "active" });

    // If cart doesn't exist, return an error
    if (!cart) {
      return res.status(404).send({ error: true, message: "Cart not found" });
    }

    // Create a new order with the user's cart
    const newOrder = new Order({
      cart: cart._id,
      customer: customer._id,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Update the status of the user's cart to "paid" or any other appropriate status
    cart.status = "paid";
    await cart.save();

    // Return the created order
    return res
      .status(201)
      .send({ success: true, message: "Order placed", savedOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const email = req.decoded?.email;
    const orderId = req.params.orderId;

    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    // Find the order to be canceled
    const order = await Order.findOne({ _id: orderId, "cart.email": email });

    // If the order doesn't exist or is already canceled, return an error
    if (!order || order.status === "cancelled") {
      return res
        .status(404)
        .send({ error: true, message: "Order not found or already cancelled" });
    }

    if (order.status === "served") {
      return res
        .status(400)
        .send({ error: true, message: "Order has already been served" });
    }
    // Update the status of the order to "cancelled"
    order.status = "cancelled";
    await order.save();

    // Return the updated order
    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    // Find all orders associated with the user's email
    // const orders = await Order.find({ "cart.email": email });
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "carts", // Assuming the collection name is "carts"
          localField: "cart",
          foreignField: "_id",
          as: "carts",
        },
      },
      {
        $match: {
          "carts.email": email,
        },
      },
    ]);

    // Return the list of orders
    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const email = req.decoded?.email;
    const orderId = req.params.orderId; // Assuming orderId is passed in the request parameters

    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    // Find the single order associated with the user's email and the specified orderId
    const order = await Order.findOne({ _id: orderId }).populate("cart");

    if (!order || order?.cart?.email !== email) {
      return res.status(404).send({ error: true, message: "Order not found" });
    }

    // Return the single order
    return res.status(200).send({ success: true, order });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

module.exports = {
  makeOrder,
  cancelOrder,
  getSingleOrder,
  getAllOrders,
};
