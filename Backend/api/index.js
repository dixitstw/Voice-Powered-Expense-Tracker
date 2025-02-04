const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  transactions: [
    {
      type: { type: String, required: true },
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: String, required: true },
      id: { type: String, required: true },
    },
  ],
});

const User = mongoose.model("User", userSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Auth Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      transactions: [],
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Transaction Routes
app.get("/api/gettransactions", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.transactions);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/posttransactions", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.transactions.push(req.body);
    await user.save();
    res.status(201).json(user.transactions);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/api/deletetransactions/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.transactions = user.transactions.filter((t) => t.id !== req.params.id);
    await user.save();
    res.json(user.transactions);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
