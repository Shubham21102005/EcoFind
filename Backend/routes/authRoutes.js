const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  updateProfile,
  getProfile
} = require("../controllers/authController");

// Public routes
router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);

// Protected route
router.put("/profile", protect, upload.single("profilePic"), updateProfile);
// Protected route: get user profile
router.get("/profile", protect, getProfile);


module.exports = router;
