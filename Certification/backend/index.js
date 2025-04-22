const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

// Remove '0x' prefix if it exists before creating the wallet
const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
  ? process.env.PRIVATE_KEY.slice(2) 
  : process.env.PRIVATE_KEY;
try {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log("Wallet created successfully");
  console.log("Wallet address:", wallet.address);
} catch (error) {
  console.error("Error creating wallet:", error);
}

const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/certificates", certificateRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {  })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
