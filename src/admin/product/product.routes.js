const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/auth"); // Assuming you have authentication middleware

// Create a new product
router.post("/products", authMiddleware('admin'), productController.createProduct);

router.delete("/products/:id", authMiddleware('admin'), productController.deleteProduct);

router.get("/products/:id", productController().getProduct);

router.put("/products/:id", authMiddleware('admin'), productController.updateProduct);

router.get("/products", productController.getProductsByCategory);

module.exports = router;
