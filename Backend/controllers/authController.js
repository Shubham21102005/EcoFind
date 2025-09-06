const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

// Helper: generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ------------------------
// Register User
// ------------------------
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle optional profile pic upload
    let profilePic = "";
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, "EcoFinds/Profiles");
      profilePic = result.secure_url;
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
    });

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Login User
// ------------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Update User Profile
// ------------------------
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Set by auth middleware
    const updates = {}; // Object to hold fields to update

    // Add username if provided
    if (req.body.username) updates.username = req.body.username;

    // Add email if provided
    if (req.body.email) updates.email = req.body.email;

    // Hash password if provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updates.password = hashedPassword;
    }

    // Upload profile pic if provided
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, "EcoFinds/Profiles");
      updates.profilePic = result.secure_url;
    }

    // Update user
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get User Profile
// ------------------------
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Set by auth middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
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
