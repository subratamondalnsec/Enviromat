// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const User = require("../models/User");
const { createOrder, requestOrder, addToCard,cancelFromAddToCard, cancelRequestOfOrder,createmultiplkeOrder, getAllOrdersByUser, getAllAddToCardsByUser } = require("../controllers/OrderController");

// Create new order
router.post("/create",createOrder);

// Request an order
router.post("/request-order",requestOrder);

// Get all orders for a user
router.get("/get-all-orders/user/:userId",getAllOrdersByUser)

// Get all addToCards for a user
router.get("/get-all-addtocards/user/:userId",getAllAddToCardsByUser)

// Add to cart
router.post("/add-to-card",addToCard)

// Cancel order request
router.post('/cancel-order',cancelRequestOfOrder)

// Cancel from add to card
router.post('/cancel-from-addtocard',cancelFromAddToCard)


// create all order at a time
router.post("/create-all-orders",createmultiplkeOrder);

module.exports = router;
