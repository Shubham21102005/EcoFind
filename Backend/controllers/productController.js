const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");
const cloudinary = require("../utils/cloudinary");

// ------------------------
// Create Product
// ------------------------
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle image upload if provided
    let image = "";
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, "EcoFinds/Products");
      image = result.secure_url;
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      image,
      seller: req.user.id,
    });

    // Add product to seller's myProducts
    await User.findByIdAndUpdate(req.user.id, { $push: { myProducts: newProduct._id } });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get All Products (with optional search & filter)
// ------------------------
exports.getAllProducts = async (req, res) => {
  try {
    const { category, keyword } = req.query;
    const filter = { isSold: false };

    if (category) filter.category = category;
    if (keyword) filter.title = { $regex: keyword, $options: "i" };

    const products = await Product.find(filter).populate("seller", "username profilePic");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get Single Product by ID
// ------------------------
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "username profilePic");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Update Product
// ------------------------
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only seller can update
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updates = {};
    const { title, description, price, category } = req.body;

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (price) updates.price = price;
    if (category) updates.category = category;

    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, "EcoFinds/Products");
      updates.image = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Delete Product
// ------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only seller can delete
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Remove from seller's myProducts
    await User.findByIdAndUpdate(req.user.id, { $pull: { myProducts: req.params.id } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Helper: Upload Image to Cloudinary
// ------------------------
const uploadImageToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(fileBuffer);
  });
};
