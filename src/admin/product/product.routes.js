const express = require("express");
const { authMiddleware } = require("../../../utils/utils");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProductsByCategory,
  updateSpecification,
  getTotalPagesForAllProducts,
} = require("./product.controller");
const productRouter = express.Router();

// Create a new product
productRouter.post("/all/", authMiddleware("admin"), createProduct);

productRouter.delete("/all/:id", authMiddleware("admin"), deleteProduct);

productRouter.get("/all/:id", getProduct);

// productRouter.get("/name/:name", getProductByName);

productRouter.put("/all/:id", authMiddleware("admin"), updateProduct);
productRouter.put(
  "/all/:id/:specificationId",
  authMiddleware("admin"),
  updateSpecification
);

productRouter.get("/all/", getProductsByCategory);
productRouter.get("/pages", getTotalPagesForAllProducts);

module.exports = productRouter;
