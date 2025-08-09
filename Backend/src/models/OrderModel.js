const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Seller who lists the item
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Buyer who requests the item
    default: null, // null if no buyer yet
  },
  product: {
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      enum: [
        "Recycled Plastic Products",
        "Recycled Paper Products",
        "Recycled Glass Products",
        "Recycled Metal Products",
        "Recycled Textile & Fabric Products",
        "Recycled Wood Products",
        "Recycled Rubber Products",
        "E-Waste Recycled Products",
        "Organic Waste Recycled Products",
        "Mixed Recycled Products"
      ],
      required: true,
    },
  },
  address: {
    type: String, // collect orde from seller at address
  },
  plasedOn:{   // address where the order was placed
    type:String,
    default:null,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  deliveryStatus: {
    type: String,
    enum: ["listed", "requested", "delivered"],
    default: "listed", // Seller created but no buyer yet
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Picker", // who delivered this order
    default: null,
  },
  image:{
    type:String,
    required:true
  },
  orderedAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  isInCart: {
    type: Boolean,
    default: false, // Used for addToCart
  },
});

module.exports = mongoose.model("Order", orderSchema);
