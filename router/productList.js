const express = require("express");
const router = express.Router();
const jwtToken = require("../common/jwtToken");
const tokenValidator = require("../middle/tokenValidator");
const prdoct = require("../module/productSymbol");
const user = require("../module/auth");
const productList = require("../module/productList");
const shop = require("../module/shop");
const Billing = require("../module/billing");
router.use(tokenValidator);
function isLiter(symbol) {
  return symbol === "liter";
}
router.get("/list", (req, res) => {
  prdoct.find({}).then(
    (data) => {
      res.status(200).json({ success: data });
    },
    (error) => {
      res.status(500).json({ error: error });
    }
  );
});
router.post("/add", (req, res) => {
  var productid = jwtToken.convertToObjectId(req.body.productType);
  prdoct
    .findOne({ _id: productid })
    .then((data2) => {
      user
        .findOne({ mobile: req.decodedToken.mobile })
        .then((data1) => {
          var data = {
            symbol: data2.symbol,
            name: req.body.productName,
            Quantity: parseInt(req.body.productQuantity),
            productTypeid: jwtToken.convertToObjectId(req.body.productType),
            productid: req.body.productId,
            userId: jwtToken.convertToObjectId(data1._id),
            pointer: isLiter(data2.symbol),
            amount: req.body.amount,
          };
          productList.create(data).then(
            (result) => {
              res.status(200).json({ success: "Successfully added product" });
            },
            (error) => {
              res.status(500).json({ error: "Please Change the Product Id" });
            }
          );
        })
        .catch((error) => {
          res.status(500).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});
router.get("/detail/:id", (req, res) => {
  user
    .findOne({ mobile: req.decodedToken.mobile })
    .then((data1) => {
      productList
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "result",
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$userId", jwtToken.convertToObjectId(data1._id)],
                  },
                ],
              },
              productid: {
                $regex: new RegExp(req.params.id),
              },
            },
          },
          {
            $project: {
              Quantity: 1,
              productTypeid: 1,
              productid: 1,
              name: 1,
              symbol: 1,
            },
          },
        ])
        .then((reult) => {
          res.status(200).json({ success: reult });
        })
        .catch((error) => {
          res.status(500).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});
router.get("/details", (req, res) => {
  user
    .findOne({ mobile: req.decodedToken.mobile })
    .then((data1) => {
      productList
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "result",
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$userId", jwtToken.convertToObjectId(data1._id)],
                  },
                ],
              },
            },
          },
          {
            $project: {
              Quantity: 1,
              productTypeid: 1,
              productid: 1,
              name: 1,
              symbol: 1,
            },
          },
        ])
        .then((data) => {
          res.status(200).json({ success: data });
        })
        .catch((error) => {
          res.status(401).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(401).json({ error: error });
    });
});

router.post("/user", (req, res) => {
  const {
    shopName,
    address,
    gstNumber,
    mobile,
    email,
    name,
    state,
    country,
    pincode,
  } = req.body;

  user
    .findOne({ mobile: req.decodedToken.mobile })
    .then((data1) => {
      var userId = jwtToken.convertToObjectId(data1._id);
      const newShop = new shop({
        shopName,
        address,
        gstNumber,
        mobile,
        email,
        name,
        state,
        country,
        pincode,
        userId,
      });

      shop
        .create(newShop)
        .then((data) => {
          res
            .status(200)
            .json({ success: "Shopkepper Data Added Successfully" });
        })
        .catch((error) => {
          res.status(401).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(401).json({ error: "Please Check Email And Mobile Number" });
    });
});

router.get("/userall", (req, res) => {
  user
    .findOne({ mobile: req.decodedToken.mobile })
    .then((data1) => {
      shop
        .find({ userId: jwtToken.convertToObjectId(data1._id) })
        .then((result) => {
          res.status(200).json({ success: result });
        })
        .catch((error) => {
          res.status(401).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(401).json({ error: "Please Check Email And Mobile Number" });
    });
});
router.get("/user/:id", (req, res) => {
  shop
    .aggregate([
      {
        $match: {
          shopName: {
            $regex: new RegExp(req.params.id),
          },
        },
      },
    ])
    .then((data) => {
      res.status(200).json({ success: data });
    })
    .catch((error) => {
      res.status(401).json({ error: error });
    });
});

router.get("/count", async (req, res) => {
  try {
    const userCount = await user.countDocuments({});
    const productCount = await productList.countDocuments({});
    const shopCount = await shop.countDocuments({});
    const count = await Billing.countDocuments({});
    res.json({
      success: {
        users: userCount,
        products: productCount,
        shops: shopCount,
        completed: count,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/listProduct", (req, res) => {
  user.findOne({ mobile: req.decodedToken.mobile }).then((data1) => {
    productList
      .find(
        { userId: jwtToken.convertToObjectId(data1._id) },
        { _id: 1, Quantity: 1, name: 1, amount: 1 }
      )
      .then((result) => {
        res.status(200).json({ success: result });
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error" });
      });
  });
});
router.post("/billing", async (req, res) => {
  try {
    if (!req.decodedToken || !req.decodedToken.mobile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userList = await user.findOne({ mobile: req.decodedToken.mobile });
    console.log(userList._id);

    if (!userList) {
      return res.status(404).json({ message: "User not found" });
    }

    var userdata = jwtToken.convertToObjectId(req.body.userId);
    var data = {
      userId: userdata,
      amount: req.body.total,
      gst: req.body.gst,
      delivery: req.body.delivery,
      quanity: req.body.quantity,
      ProductId: jwtToken.convertToObjectId(req.body.product),
      ownerId: jwtToken.convertToObjectId(userList._id),
    };
    const productData = await productList.findOne({
      _id: jwtToken.convertToObjectId(req.body.product),
    });
    if (!productData) {
      return res.status(404).json({ message: "product not found" });
    }
    const updatedQuantity = productData.Quantity - data.quanity;
    if (updatedQuantity < 0) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    await productList.updateOne(
      { _id: jwtToken.convertToObjectId(req.body.product) },
      { $set: { Quantity: updatedQuantity } }
    );

    Billing.create(data).then((data) => {
      res.status(201).json({
        message: data._id,
      });
    });
  } catch (error) {
    console.error("Error creating billing entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/getbilling/:id", (req, res) => {
  try {
    if (!req.decodedToken || !req.decodedToken.mobile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    Billing.findOne({ _id: jwtToken.convertToObjectId(req.params.id) }).then(
      (data) => {
        res.status(200).json({ message: data });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
