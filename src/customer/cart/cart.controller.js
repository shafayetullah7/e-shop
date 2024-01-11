const Product = require("../../../model/Product");
const Cart = require("../../../model/customer/Cart");
const Customer = require("../../../model/customer/Customer");

const addToCart = async (req, res) => {
  try {
    const email = req.decoded?.email;
    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }
    const existingCart = await Cart.findOne({
      $and: [{ email }, { status: "active" }],
    });
    const productData = {
      productId,
      quantity,
      unitPrice: product.price,
      price: Number(quantity) * Number(product.price),
    };
    if (!existingCart) {
      const newCart = new Cart({
        email,
        productList: [productData],
        status: "active",
      });
      const createdCart = await newCart.save();
      return res.status(200).send(createdCart);
    } else {
      const newPrice = parseInt(quantity) * product.price;
      const productInCart = await Cart.findOne({
        email,
        status: "active",
        "productList.productId": productId,
      });
      console.log(productInCart);
      if (productInCart) {
        const updatedCart = await Cart.findOneAndUpdate(
          { email, status: "active", "productList.productId": productId },
          {
            $set: {
              "productList.$.quantity": quantity,
              "productList.$.unitPrice": Number(product.price),
              "productList.$.price": newPrice,
            },
          },
          { upsert: true, new: true }
        );
        return res.status(200).send(updatedCart);
      } else {
        const updatedCart = await Cart.findOneAndUpdate(
          { email, status: "active" },
          {
            $push: {
              productList: {
                productId,
                quantity,
                unitPrice: Number(product.price),
                price: newPrice,
              },
            },
          },
          { upsert: true, new: true }
        );
        console.log(updatedCart);
        return res.status(200).send(updatedCart);
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const email = req.decoded?.email;
    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    const { productId } = req.params;

    // Validate productId
    if (!productId) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }

    // Find the cart for the given user and with "active" status
    const cart = await Cart.findOne({ email, status: "active" });

    // If cart doesn't exist, return an error
    if (!cart) {
      return res.status(404).send({ error: true, message: "Cart not found" });
    }

    // Update the cart by removing the specified product
    const updatedCart = await Cart.findOneAndUpdate(
      { email, status: "active", "productList.productId": productId },
      {
        $pull: { productList: { productId } },
      },
      { new: true }
    );

    // If the product was not found in the cart, return an error
    if (!updatedCart) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found in the cart" });
    }

    // Return the updated cart
    return res.status(200).send(updatedCart);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const getAllItemsInCart = async (req, res) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    // Find the cart for the given user and with "active" status
    const cart = await Cart.findOne({ email, status: "active" }).populate({
      path: "productList.productId",
      select: "name price productImage company",
    });

    // If cart doesn't exist, return an error
    if (!cart) {
      return res.status(404).send({ error: true, message: "Cart not found" });
    }

    // Return the items in the cart
    return res.status(200).send({ cart });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Something went wrong" });
  }
};

const updateCart = async (req, res) => {
  try {
    const email = req.decoded?.email;
    if (!email) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res
        .status(400)
        .send({ error: true, message: "Missing required data" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }

    const newPrice = parseInt(quantity) * product.price;
    await Cart.updateOne(
      { email, status: "active", "productList.productId": productId },
      {
        $set: {
          "productList.$.quantity": quantity,
          "productList.$.price": newPrice,
        },
      }
    );
    res.status(200).send({ message: "Updated Successfully" });
  } catch (err) {
    res.status(500).send({ error: true, message: "Something went wrong" });
  }
};

module.exports = {
  addToCart,
  updateCart,
  getAllItemsInCart,
  removeFromCart,
};
