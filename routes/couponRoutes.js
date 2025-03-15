const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const requestIp = require("request-ip");

// Get all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Claim a coupon
router.get("/claim", async (req, res) => {
  try {
    const userIp = requestIp.getClientIp(req);
    const existingClaim = await Coupon.findOne({ claimedBy: userIp });

    if (existingClaim) {
      return res.status(400).json({ message: "You have already claimed a coupon!" });
    }

    const availableCoupon = await Coupon.findOne({ isClaimed: false });
    if (!availableCoupon) {
      return res.status(404).json({ message: "No coupons available." });
    }

    availableCoupon.isClaimed = true;
    availableCoupon.claimedBy = userIp;
    await availableCoupon.save();

    res.json({ message: "Coupon claimed!", coupon: availableCoupon });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;