const Product = require("../../../model/Product");

// Create a new product
const createProduct = async (req, res) => {
  try {
    if (req.decoded.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    if (req.decoded.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    if (req.decoded.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Extract the fields from req.body
    const { specification, ...updatedFields } = req.body;

    // Remove fields that should not be updated
    delete updatedFields.createdAt;
    delete updatedFields.updatedAt;
    delete updatedFields.status;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedFields,
        $addToSet: specification
          ? { specification: { $each: specification } }
          : {},
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validations on update
      }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all products based on category
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;

    // If category is not provided, return all products
    const query = category ? { category } : {};
    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSpecification = async (req, res) => {
  try {
    const productId = req.params.id; // replace with your actual product ID
    const specificationId = req.params.specificationId; // replace with your actual specification ID
    const { title, value } = req.body;

    const result = await Product.updateOne(
      { _id: productId, "specification._id": specificationId },
      {
        $set: {
          "specification.$.title": title,
          "specification.$.value": value,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "Product or specification not found" });
    }

    // Product specification updated successfully
    res.json({ message: "Product specification updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  getProductsByCategory,
  updateSpecification,
};
