const express = require("express");
const router = express.Router();
const mongo = require("mongoose");
const sales = mongo.model("sales");
const authMiddleware = require("../middleware/authentication");

// Adding  Sales
router.post("/addSales", authentication, async (req, res) => {
  try {
    const { productName, quantity, amount } = req.body;
    if (!productName || !quantity || !amount) {
      return res.status(400).json({ err: "Fill all the mandatory Fields" });
    }
    req.user.password = undefined;
    const addSales = new sales({
      productName: productName,
      quantity: quantity,
      amount: amount,
      author: req.user,
    });
    const newSales = await addSales.save();
    res.status(201).json({ sales: newSales });
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "something went wrong" });
  }
});

//  TOP 5  SALES
router.get("/topSales", authentication, async (req, res) => {
  try {
    const topsales = await sales
      .find({ author: req.user._id })
      .populate("author", "_id productName quantity amount")
      .sort({ quantity: -1 })
      .limit(5);
    console.log({ sales: topsales });
    res.status(200).json({ sales: topsales });
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Something went wrong" });
  }
});

// Total revenue
router.get("/revenue", async (req, res) => {
  try {
    const salesAmount = await sales.find().sort({ amount: -1 }).limit(5);
    res.status(200).json({ sales: salesAmount });
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Something went wrong" });
  }
});

module.exports = router;
