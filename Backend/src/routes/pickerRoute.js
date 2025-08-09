const express = require("express")
const router = express.Router()

const {
  login,
  signup,
  sendotp,
  changePassword,
  logout,
} = require("../controllers/PickerAuth")

const {
  getPickerProfile,
  updatePickerProfile,
} = require("../controllers/PickerProfile")

const { auth } = require("../middleware/auth")

// Routes for Picker Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Picker route working!" })
})

// Route for picker login
router.post("/login", login)

// Route for picker signup
router.post("/signup", signup)

// Route for sending OTP to the picker's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// Route for picker logout
router.post("/logout", logout)

// ********************************************************************************************************
//                                      Profile routes (TODO: Implement controllers)
// ********************************************************************************************************

// Route for getting picker profile
router.get("/profile/:id", auth, getPickerProfile)

// Route for updating picker profile
router.put("/profile/:id", auth, updatePickerProfile)

module.exports = router
