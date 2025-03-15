const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

router.get("/claim", async (req, res) => {
  try {
    const userIp = req.clientIp; // Get user's IP

    // Check if this user has already claimed a coupon
    const existingClaim = await Coupon.findOne({ claimedBy: userIp });

    if (existingClaim) {
      return res.status(400).json({ message: "You have already claimed a coupon!", coupon: existingClaim });
    }

    const availableCoupon = await Coupon.findOne({ isClaimed: false });

    if (!availableCoupon) {
      return res.status(404).json({ message: "No coupons available." });
    }

    // Mark coupon as claimed & store user's IP
    availableCoupon.isClaimed = true;
    availableCoupon.claimedBy = userIp;
    await availableCoupon.save();

    res.json({ message: "Coupon claimed!", coupon: availableCoupon });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;