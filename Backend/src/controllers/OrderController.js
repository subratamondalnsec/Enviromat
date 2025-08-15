// controllers/orderController.js
const Order = require("../models/OrderModel");
const User = require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader")


exports.getAllItems = async (req, res) => {
  try {
    const orders = await Order.find({
      $expr: { $lt: ["$product.totalSold", "$product.quantity"] }
    });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching all items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const { sellerId, product, image, address } = req.body;

    const newOrder = new Order({
      sellerId,
      product,
      address,
      image,
      orderedAt: new Date()
    });

    await newOrder.save();

    // Add to seller's sellingOrders
    const user=await User.findByIdAndUpdate(sellerId, {
      $push: { sellingOrders: newOrder._id }
    },{new:true});

    console.log("Order created successfully",newOrder,user);

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.requestOrder = async (req, res) => {
  try {
    const { buyerId, orderId, quantity, price, address } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check stock
    if (order.product.totalSold + quantity > order.product.quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Add buyer details
    order.buyerDetails.push({
      buyerId,
      quantity,
      price,
      address: address,
      paymentStatus: "pending",
      deliveryStatus: "requested"
    });

    // Update stock
    order.product.totalSold += quantity;
    order.orderedAt = new Date();

    await order.save();

    // Update buyer's orders
    const user=await User.findByIdAndUpdate(buyerId, {
      $push: { orderRequests: order._id },
      $pull: { addToCards: order._id }
    },{new:true});
    console.log("Order requested successfully",order,user);
    res.json({ message: "Order requested successfully", order });
  } catch (error) {
    console.error("Error requesting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 3️⃣ Buyer adds an item to their cart (for later purchase)
 */
exports.addToCard = async (req, res) => {
  try {
    const { buyerId, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const buyer=await User.findByIdAndUpdate(buyerId, {
      $push: { addToCards: order._id },
    }, { new: true });

    console.log("Order added to cart:", order," buyer:",buyer);
    res.json({ message: "Item added to cart", order });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 4️⃣ Buyer cancels a requested order
 */
exports.cancelRequestOfOrder = async (req, res) => {
  try {
    const { buyerId, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Find buyer entry
    const buyerIndex = order.buyerDetails.findIndex(b => b.buyerId.toString() === buyerId);
    if (buyerIndex === -1) {
      return res.status(403).json({ message: "You have not requested this order" });
    }

    // Restore stock
    order.product.totalSold -= order.buyerDetails[buyerIndex].quantity;

    // Remove buyer from order
    order.buyerDetails.splice(buyerIndex, 1);

    const newOrder=await order.save();

    // Remove from buyer's order requests
    const user=await User.findByIdAndUpdate(buyerId, {
      $pull: { orderRequests: order._id }
    });
    console.log("Order request cancelled successfully",newOrder,user);

    res.json({ message: "Order request cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order request:", error);
    res.status(500).json({ message: "Server error" });
  }
};  


exports.cancelFromAddToCard = async (req, res) => {
  try {
    const { buyerId, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Remove order from buyer's addToCards
    const buyer = await User.findByIdAndUpdate(
      buyerId,
      { $pull: { addToCards: order._id } },
      { new: true }
    );

    console.log("Order removed from cart successfully:", order, "Buyer:", buyer);

    res.json({ message: "Order removed from cart successfully", order });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 1️⃣ Get all orders placed by the user
exports.getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ "buyerDetails.buyerId": userId });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Get all Add-to-Cart orders from user model
exports.getAllAddToCardsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("addToCards");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User:", user);
    res.status(200).json({
      success: true,
      count: user.addToCards.length,
      addToCard: user.addToCards
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const orders=[
  {
    "product": {
      "quantity": 2,
      "category": "Recycled Plastic Products"
    },
    "address": "123 Eco Street, Green City",
    "image": "https://example.com/images/recycled-plastic-chair.jpg"
  },
  {
    "product": {
      "quantity": 5,
      "category": "Recycled Paper Products"
    },
    "address": "456 Paper Lane, Sustainable Town",
    "image": "https://example.com/images/recycled-paper-notebook.jpg"
  },
  {
    "product": {
      "quantity": 1,
      "category": "Recycled Glass Products"
    },
    "address": "789 Glass Avenue, ZeroWaste City",
    "image": "https://example.com/images/recycled-glass-vase.jpg"
  },
  {
    "product": {
      "quantity": 3,
      "category": "Recycled Metal Products"
    },
    "address": "321 Metal Road, GreenTown",
    "image": "https://example.com/images/recycled-metal-bottle.jpg"
  },
  {
    "product": {
      "quantity": 4,
      "category": "Recycled Textile & Fabric Products"
    },
    "address": "654 Fabric Street, EcoVillage",
    "image": "https://example.com/images/recycled-fabric-bag.jpg"
  }
];


// 5️⃣ Create multiple orders at once
exports.createmultiplkeOrder = async (req, res) => {
  try {
    // orders should be an array of order objects

    const { userId } = req.body;

    if (!userId || !orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Create all orders in one go
    const createdOrders = await Order.insertMany(
      orders.map(order => ({
        ...order,
        sellerId:userId
      }))
    );

    // Get IDs of created orders
    const orderIds = createdOrders.map(order => order._id);

    // Update user addToCard array
    await User.findByIdAndUpdate(
      userId,
      { $push: { sellingOrders: { $each: orderIds } } },
      { new: true }
    );

    res.status(201).json({
      message: "Orders created successfully",
      createdOrders
    });

  } catch (error) {
    console.error("Error creating multiple orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};