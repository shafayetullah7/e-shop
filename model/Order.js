const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    customer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    status: {
      type: String,
      enum: ["pending", "served", "rejected", "cancelled"],
      default: "pending",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
