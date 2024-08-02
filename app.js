// server.js

const express = require("express");
const app = express();
const port = 3000;
const db = require("./database/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const product = require("./router/productList");
app.use(cors());

//Auth Router
const auth = require("./router/authRouter");

app.use(express.json());
app.use(bodyParser.json());
app.set(db, db);
app.use("/auth", auth);
app.use("/product", product);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
