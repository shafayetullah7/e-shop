const express = require("express");
const { authMiddleware } = require("../../../utils/utils");
const { createProduct, deleteProduct, updateProduct, getProduct, getProductsByCategory } = require("./product.controller");
const productRouter = express.Router();


// Create a new product
productRouter.post("/", authMiddleware('admin'), createProduct);

productRouter.delete("/:id", authMiddleware('admin'), deleteProduct);

productRouter.get("/:id", getProduct);

productRouter.put("/:id", authMiddleware('admin'), updateProduct);

productRouter.get("/", getProductsByCategory);

module.exports = productRouter;
