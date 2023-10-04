require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./db");
const adminSpecificRouter = require("./routes/admin/admin.specific.router");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "welcome to eshop" });
});


app.use('/admin',adminSpecificRouter);


connectToDatabase()
.then(()=>{
    app.listen(port,()=>{
        console.log('listening from',port);
    })
})
.catch((error)=>{
    console.log('Error connecting to database: ',error.message);
})

// app.listen(port, () => {
//   console.log("listening from", port);
// });
