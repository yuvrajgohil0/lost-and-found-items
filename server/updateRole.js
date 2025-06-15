const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne({ email: "admin@example.com" });
    if (!user) {
      console.log("❌ User not found");
      return mongoose.disconnect();
    }

    user.role = "admin";
    await user.save();
    console.log("✅ User role updated to admin successfully");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
