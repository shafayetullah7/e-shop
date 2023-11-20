const Order = require("../../../model/Order");
const Cart = require("../../../model/customer/Cart");


// Controller to make a new order
const makeOrder = async (req, res) => {
  try {
    const { cartId } = req.body;

    // Check if the provided cartId is valid
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Create a new order
    const order = new Order({
      cart: cartId,
    });

    await order.save();

    // Update the status of the cart to 'paid'
    cart.status = 'paid';
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller to cancel an order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the provided orderId is valid
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status of the order to 'cancelled'
    order.status = 'cancelled';
    await order.save();

    // Update the status of the associated cart to 'active'
    const cart = await Cart.findById(order.cart);
    if (cart) {
      cart.status = 'active';
      await cart.save();
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  makeOrder,
  cancelOrder,
};
