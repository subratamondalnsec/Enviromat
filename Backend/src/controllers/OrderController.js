// controllers/orderController.js
const Order = require("../models/OrderModel");
const User = require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader")


/**
 * 1️⃣ Seller creates a new item listing
 */
exports.createOrder = async (req, res) => {
  try {
    const { sellerId, product,image, address } = req.body;

    // const file=req.file.image;
    // const result = await uploadImageToCloudinary(file,process.env.CLOUDINARY_FOLDER);

    const newOrder = new Order({
      sellerId,
      product,
      address,
      image,
      deliveryStatus: "listed", // Initial status when created
    });

    await newOrder.save();

    // Add to seller's sellingOrders
    await User.findByIdAndUpdate(sellerId, {
      $push: { sellingOrders: newOrder._id },
    });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 2️⃣ Buyer requests an item for purchase
 */
exports.requestOrder = async (req, res) => {
  try {
    const { buyerId, orderId, address } = req.body;
    const order = await Order.findById(orderId);
    console.log("Order found:", order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyerId || order.isInCart) {
      return res.status(400).json({ message: "Order already requested or added to card" });
    }

    // Check if orderId exists in buyer's addToCards
    const buyer = await User.findById(buyerId);
    if (!buyer || !buyer.addToCards || !buyer.addToCards.includes(orderId)) {
      return res.status(400).json({ message: "Order not found in your cart" });
    }

    order.buyerId = buyerId;
    order.plasedOn = address;
    order.deliveryStatus = "requested";
    order.orderedAt = new Date();

    await order.save();

    // Add to buyer's orderRequests and remove from addToCards if present
    editBuyer = await User.findByIdAndUpdate(
      buyerId,
      {
      $push: { orderRequests: order._id },
      $pull: { addToCards: order._id }
      },
      { new: true }
    );

    console.log("Order requested successfully:", order, "Buyer:", editBuyer);

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
    if (order.isInCart) {
      return res.status(400).json({ message: "Item already in cart" });
    }

    order.isInCart = true;
    await order.save();

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

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!order.buyerId || order.buyerId.toString() !== buyerId) {
      return res.status(403).json({ message: "You have not requested this order" });
    }

    // Remove from buyer's requests
    const buyer=await User.findByIdAndUpdate(buyerId, {
      $pull: { orderRequests: order._id },
    },{ new: true });

    order.buyerId = null;
    order.address = null;
    order.deliveryStatus = "listed";
    order.orderedAt = null;
    order.isInCart = false; // Reset cart status if needed

    await order.save();

    console.log("Order request cancelled successfully:", order, "Buyer:", buyer);
    res.json({ message: "Order request cancelled successfully", order});
  } catch (error) {
    console.error("Error cancelling order request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 4️⃣ Remove an item from buyer's addToCards (cart)
 */
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

    // Update order's isInCart status
    order.isInCart = false;
    await order.save();

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

    const user = await User.findById(userId).populate("orderRequests");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const orders = user.orderRequests;

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