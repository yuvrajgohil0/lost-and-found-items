const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const multer = require("multer");
const path = require("path");

// 📁 Setup multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// ✅ Route: Add Lost or Found Item (with photo)
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    let {
      itemType,
      color,
      location,
      date,
      isLost,
      contactName,
      contactPhone,
      description,
    } = req.body;

    // Convert to lowercase for consistent matching
    itemType = itemType.toLowerCase();
    color = color.toLowerCase();
    location = location.toLowerCase();

    const newItem = new Item({
      itemType,
      color,
      location,
      date,
      isLost,
      contactName,
      contactPhone,
      description,
      photo: req.file ? req.file.filename : null,
    });

    await newItem.save();
    res.status(201).json({ message: "✅ Item saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Error saving item." });
  }
});

// ✅ Route: Search for Matching Found Items (case-insensitive + partial match for location)
// ✅ Route: Search for Matching Found Items (with flexible location match)
router.post("/search", async (req, res) => {
  try {
    const { itemType, color, location } = req.body;

    const matchedItems = await Item.find({
      itemType: { $regex: new RegExp("^" + itemType + "$", "i") },
      color: { $regex: new RegExp("^" + color + "$", "i") },
      isLost: false,
      $or: [
        { location: { $regex: new RegExp(location, "i") } },
        { location: { $regex: new RegExp("^" + location.split(" ")[0], "i") } },
      ]
    });

    if (matchedItems.length > 0) {
      res.status(200).json(matchedItems);
    } else {
      res.status(404).json({ message: "❌ No matching items found." });
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "❌ Search error." });
  }
});


// ✅ Route: Confirm ownership
router.post("/confirm/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "❌ Item not found." });
    }

    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: "✅ Ownership confirmed and item deleted.", item });
  } catch (error) {
    res.status(500).json({ error: "❌ Error confirming item." });
  }
});

// ✅ Route: View all items (for testing)
router.get("/", async (req, res) => {
  try {
    const allItems = await Item.find();
    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching items." });
  }
});

// 🧪 Route: Delete all items (for testing only)
router.get("/deleteAll", async (req, res) => {
  try {
    await Item.deleteMany({});
    res.send("✅ All items deleted (testing).");
  } catch (err) {
    res.status(500).send("❌ Failed to delete items.");
  }
});

module.exports = router;
