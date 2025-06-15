const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  isLost: {
    type: Boolean,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: null,
  },
});

// ✅ Prevent OverwriteModelError in development
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

module.exports = Item;
