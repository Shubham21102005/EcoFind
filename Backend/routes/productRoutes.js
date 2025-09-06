const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");

// Public routes
router.get("/", getAllProducts);           // List all products (with optional search & filter)
router.get("/:id", getProductById);       // Get single product by ID

// Protected routes (only authenticated users can create/update/delete)
router.post("/", protect, upload.single("image"), createProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
