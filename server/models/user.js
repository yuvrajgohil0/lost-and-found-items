const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  // ✅ Role can be either 'user' or 'admin'
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

// ✅ Prevent model overwrite error in development (especially in Next.js/Node.js)
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
