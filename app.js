const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.set("view engine", "jade");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/products", require("./routes/products"));

app.listen(8000, function () {
  console.log("app is running");
});
