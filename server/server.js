// ✅ Updated server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path"); // ✅ Add this for serving frontend

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// ✅ Serve static files from client folder (frontend)
app.use(express.static(path.join(__dirname, "client"))); // ✅ Important for frontend

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => {
    res.send("Lost and Found Backend is running ✅");
});

// ✅ Import Routes
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ Use Routes
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
