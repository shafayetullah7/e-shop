const Cart = require("../../../model/customer/Cart");
const Customer = require("../../../model/customer/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createCustomer = async (req, res) => {
  try {
    const { email, fname, lname, password, image } = req.body;
    if (!email || !fname || !password || !lname) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    // Check if an Customer with the given username or email already exists
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(403).send({ error: true, message: "Already exists" });
    }

    if (password.length < 6) {
      return res.status(400).send({
        error: true,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Customer
    const newCustomer = new Customer({
      password: hashedPassword,
      email,
      fname,
      lname,
      image,
    });

    // Save the new Customer to the database
    await newCustomer.save();
    delete newCustomer.password;

    const token = jwt.sign(
      { userId: newCustomer._id, email: newCustomer.email, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    return res
      .status(200)
      .send({ success: true, message: "Customer created", newCustomer, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).send({
        success: false,
        message: "Customer not found",
      });
    }
    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      return res.status(400).send({
        success: false,
        message: "Wrong user info",
      });
    }

    const token = jwt.sign(
      { userId: customer._id, email: customer.email, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    return res
      .status(200)
      .send({ success: true, message: "Customer logged in", customer, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};


module.exports = {
  createCustomer,
  customerLogin,
};
