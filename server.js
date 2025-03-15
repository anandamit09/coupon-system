const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const requestIp = require("request-ip"); // Get user's IP
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestIp.mw());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const couponRoutes = require("./routes/couponRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));