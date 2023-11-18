const Customer = require('../../../model/customer/Customer');
const bcrypt = require('bcrypt');
const createCustomer = async (req, res) => {
  try {
    const { email, fname, lname, password } = req.body;
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
      lname
    });

    // Save the new Customer to the database
    await newCustomer.save();

    return res.status(200).send({ newCustomer });
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

module.exports = {
  createCustomer
}