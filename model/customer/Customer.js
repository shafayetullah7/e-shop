const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  image: {
    type: String,
  }
},
{
  timestamps: true
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;