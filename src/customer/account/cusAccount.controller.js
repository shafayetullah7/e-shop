const Cart = require('../../../model/customer/Cart');
const Customer = require('../../../model/customer/Customer');
const bcrypt = require('bcrypt');
const createCustomer = async (req, res) => {
  try {
    const { email, fname, lname, password, image } = req.body;
    if (!email || !fname || !password || !lname ) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    // Check if an Customer with the given username or email already exists
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(403).send({ error: true, message: "Already exists" });
    }

    if (password.length<6) {
      return res
        .status(400)
        .send({ error: true, message: "Password must be at least 6 characters" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Customer
    const newCustomer = new Customer({
      password: hashedPassword,
      email,
      fname,
      lname,
      image
    });

    // Save the new Customer to the database
    await newCustomer.save();
    const customer = {
      fname,
      lname,
      email,
      image
    };
    return res.status(200).send(customer);
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};
const addToCart = async ( req, res ) => {
  try {
    const { email, product } = req.body;
    if( !email || !product){
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    const existingCart = await Cart.findOne({$and: [
      {email},
      {status: 'active'}
    ]});
    if (!existingCart){
      const newCart = new Cart({
        email,
        productList: [product],
        status: 'active'
      });
      const createdCart = await newCart.save();
      res.status(200).send(createdCart);
    }else{
      const updatedCart = await Cart.findOneAndUpdate({$and: [
        {email},
        {status: 'active'}
      ]},
      {$push: {productList: product}},
      {new : true}
      );
      res.status(200).send(updatedCart);
    }
  } catch (error) {
    return res
    .status(500)
    .send({ error: true, message: "Something went wrong"});
  }
};
const updateCart = async ( req, res ) => {
  try {
    const {email, productId, quantity } = req.body;
  await Cart.updateOne(
    { email: email, 'productList.productId': productId },
    { $set: { 'productList.$.quantity': quantity } }
  );
  res.status(200).send({message: "Updated Successfully"});
  } catch (err) {
    res.status(500).send({ error: true, message: "Something went wrong"});
  }
};
module.exports = {
  createCustomer,
  addToCart,
  updateCart
}