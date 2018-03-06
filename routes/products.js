const express = require("express");
const router = express.Router();
var fs = require("fs");

var readStream = fs.createReadStream("./dB.json");

var CategoryArray = {};
var productsCart = [];
readStream.on("data", data => {
  productsCart = JSON.parse(data);
});

router.get("/", function(req, res, next) {
  res.json({ productsCart });
});

router.get("/add", function(req, res, next) {
  res.json({ productsCart });
});

router.post("/add", function(req, res, next) {
  var product = req.body;
  console.log("product", product);
  var id = productsCart.productsArray.length;
  product.id = ++id;
  productsCart.productsArray.push(product);
  var writeStream = fs.createWriteStream("./dB.json");
  writeStream.write(JSON.stringify(productsCart), err => {
    if (err) throw err;
    else {
      var successmessage = "Successfully Added the new Product";
      res.status(200).json({ successmessage });
    }
  });
});

router.get("/edit/:id", function(req, res) {
  var id = req.params.id;
  var index = productsCart.productsArray.findIndex(p => p.id == id);
  res.json({ productDetails: productsCart.productsArray[index] });
});

router.post("/edit/:id", function(req, res) {
  var product = req.body;
  var id = req.params.id;
  var idx = productsCart.productsArray.findIndex(p => p.id == id);
  product.id = id;
  productsCart.productsArray[idx] = product;
  var writeStream = fs.createWriteStream("./dB.json");
  writeStream.write(JSON.stringify(productsCart), err => {
    if (err) throw err;
    else {
      var editmsg = "Product is edited successfully";
      res.json({ editmsg });
    }
  });
});

router.get("/del/:id", function(req, res) {
  var id = req.params.id;
  var deletemsg;
  var delindex = productsCart.productsArray.findIndex(p => p.id == id);
  if (delindex != -1) {
    productsCart.productsArray.splice(delindex, 1);
    var writeStream = fs.createWriteStream("./dB.json");
    writeStream.write(JSON.stringify(productsCart), err => {
      if (err) throw err;
      else {
        deletemsg = "Successfully deleted" + " " + id;
        res.json({ deletemsg });
      }
    });
  } else {
    error = "Invalid" + " " + id;
    res.json({ error });
  }
});

router.post("/view", function(req, res) {
  if (req.body.id) {
    var idx = productsCart.productsArray.findIndex(p => p.id == req.body.id);
    res.json({ productDetails: productsCart.productsArray[idx] });
  } else if (req.body.productName) {
    var result = productsCart.productsArray.filter(
      p => p.productName == req.body.productName
    );
    res.json({ productDetails: result });
  }
});

router.get("/viewCategory", function(req, res) {
  var categoryArrayDivision = [];

  for (i = 0; i < productsCart.productsArray.length; i++) {
    categoryArrayDivision.push(productsCart.productsArray[i].category);
  }
  for (i = 0; i < categoryArrayDivision.length - 1; i++) {
    for (j = 1; j < categoryArrayDivision.length; j++) {
      if (categoryArrayDivision[i] == categoryArrayDivision[j]) {
        categoryArrayDivision.splice(j, 1);
      }
    }
  }
  for (i = 0; i < categoryArrayDivision.length; i++) {
    let CatObjvalue = [];
    let count = 0;
    for (j = 0; j < productsCart.productsArray.length; j++) {
      if (categoryArrayDivision[i] == productsCart.productsArray[j].category) {
        CatObjvalue[count] = productsCart.productsArray[j];
        count++;
      }
    }

    CategoryArray[categoryArrayDivision[i]] = CatObjvalue;
  }
  res.json({ Category: CategoryArray });
});

router.get("/search/:val", function(req, res, next) {
  var val = req.params.val.toLowerCase();
  var searchresult = [];
  var arr = productsCart.productsArray;
  searchresult = arr.filter(function(obj) {
    return obj.productName
      .toString()
      .toLowerCase()
      .includes(val);
  });
  res.json({ searchresult: searchresult });
});

router.get("/globalSearch/:val", (req, res, next) => {
  var globalSearchResult = [];
  var val = req.params.val.toLowerCase();
  var arr = productsCart.productsArray;

  globalSearchResult = arr.filter(function(obj) {
    return Object.keys(obj).some(function(key) {
      return obj[key]
        .toString()
        .toLowerCase()
        .includes(val);
    });
  });
  res.json({ globalSearchResult: globalSearchResult });
});

module.exports = router;
