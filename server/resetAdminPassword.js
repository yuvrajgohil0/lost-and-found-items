// resetAdminPassword.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
require("dotenv").config(); // For MongoDB connection string

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = "admin@example.com"; // 🔁 Yaha admin ka email likho
    const newPassword = "admin123";     // 🔁 Yaha naya password likho

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (updatedUser) {
      console.log("✅ Admin password reset successful.");
    } else {
      console.log("❌ Admin user not found.");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error resetting password:", err.message);
  }
};

resetPassword();
