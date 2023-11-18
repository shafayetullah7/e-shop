const Product = require("../../../model/Product");


// Create a new product
const createProduct = async (req, res) => {
  try {
    if (req.decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    if (req.decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    if (req.decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Ensure certain fields cannot be updated
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.status;

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run model validations on update
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  getProductsByCategory,
};
