require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const connectToDatabase = require("./db");
const adminSpecificRouter = require("./src/admin/admin.specific.router");
const customerSpecificRouter = require("./src/customer/customer.specific.router");


const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

connectToDatabase();

app.get("/", (req, res) => {
  res.send({ message: "welcome to eshop" });
});


app.use('/admin',adminSpecificRouter);
app.use('/customer', customerSpecificRouter);

mongoose.connection.once('open', () => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
});

// app.listen(port, () => {
//   console.log("listening from", port);
// });
