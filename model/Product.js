const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  specification: [{
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  }],
  company: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  countryOfOrigin: {
    type: String,
    required: true,
  },
  productImage: {
    type: String, // Assuming you store the image URL
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active',
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
