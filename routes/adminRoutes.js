const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Coupon = require("../models/Coupon");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secretkey");
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ admin: "admin" }, "secretkey", { expiresIn: "1h" });
  res.json({ token });
});

// Get all coupons
router.get("/coupons", authMiddleware, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// Get claimed coupons
router.get("/claim-history", authMiddleware, async (req, res) => {
  const claimedCoupons = await Coupon.find({ isClaimed: true });
  res.json(claimedCoupons);
});

// Add new coupon
router.post("/coupon", authMiddleware, async (req, res) => {
  const { code } = req.body;
  const newCoupon = new Coupon({ code });
  await newCoupon.save();
  res.json({ message: "Coupon added!" });
});

// Update coupon (code & claimed status)
router.put("/coupon/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { code, isClaimed } = req.body;
  
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { code, isClaimed },
        { new: true }
      );
  
      res.json({ message: "Coupon updated!", coupon: updatedCoupon });
    } catch (error) {
      res.status(500).json({ message: "Server error!" });
    }
  });

  router.put("/reset-coupons", authMiddleware, async (req, res) => {
    try {
      await Coupon.updateMany({}, { isClaimed: false, claimedBy: null });
      res.json({ message: "All coupons have been reset!" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting coupons!" });
    }
  });
  
  // Delete a coupon
router.delete("/coupon/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
  
      if (!deletedCoupon) {
        return res.status(404).json({ message: "Coupon not found!" });
      }
  
      res.json({ message: "Coupon deleted!" });
    } catch (error) {
      res.status(500).json({ message: "Server error!" });
    }
  });  

module.exports = router;