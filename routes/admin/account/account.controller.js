const bcrypt = require("bcrypt");
const Admin = require("../../../model/Admin");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    // Check if an admin with the given username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      return res.status(403).send({ error: true, message: "Already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email,
    });

    // Save the new admin to the database
    await newAdmin.save();

    return res.status(200).send({ newAdmin });
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    // Find the admin by the username
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).send({ error: true, message: "Admin not found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res
        .status(404)
        .send({ error: true, message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: "admin" },
      "your_secret_key", // Replace with a strong secret key
      { expiresIn: "1h" } // Token expiration time
    );

    return res.status(200).send({ admin, token });
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const isAdmin = (req, res, next) => {
  // Get the token from the request headers or query parameters
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: true, message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ error: true, message: "Failed to authenticate token" });
    }

    // Check if the decoded user is an admin (customize this based on your token structure)
    if (decoded.role === "admin") {
      // Admin user, proceed to the next middleware or route handler
      next();
    } else {
      // Non-admin user, send unauthorized response
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized access" });
    }
  });
};

module.exports = {
  createAdmin,
  loginAdmin,
  isAdmin,
};
