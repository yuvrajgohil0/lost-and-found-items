const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ User Registration (auto role: admin for 1 email only)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // ✅ admin banega agar email hai "admin@example.com"
      role: email === "admin@example.com" ? "admin" : "user"
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ✅ Admin-only: View all users
router.get("/all-users", authMiddleware.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin Dashboard Data
router.get("/admin/data", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const users = await User.find({}, "-password");
    const items = await Item.find();

    res.json({ users, items });
  } catch (err) {
    console.error("❌ Admin route error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ✅ DELETE a user by admin
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete user error:", err.message);
    res.status(500).json({ message: "Error deleting user" });
  }
});
// just saving file again

// ✅ DELETE an item by admin
router.delete("/delete-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Delete item error:", err.message);
    res.status(500).json({ message: "Error deleting item" });
  }
});

module.exports = router;
