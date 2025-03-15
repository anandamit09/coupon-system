const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isClaimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null } // Stores User IP
});

module.exports = mongoose.model("Coupon", CouponSchema);
