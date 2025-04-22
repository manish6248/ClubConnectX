// certificateRoutes.js
const express = require("express");
const { ethers } = require("ethers");
const Certificate = require("../models/Certificate");
const path = require("path");
require("dotenv").config();

const router = express.Router();

let provider;
let wallet;
let certificateContract;

// Initialize blockchain connection
const initializeBlockchain = () => {
  try {
    provider = new ethers.JsonRpcProvider(process.env.GANACHE_RPC_URL);
    console.log("Ganache RPC URL:", process.env.GANACHE_RPC_URL);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Wallet initialized with private key:", process.env.PRIVATE_KEY.slice(0, 10) + "...");

    const contractPath = path.join(__dirname, "../../artifacts/contracts/Certificate.sol/Certificate.json");
    if (!require(contractPath)) {
      throw new Error("Contract ABI file not found at: " + contractPath);
    }
    const contractABI = require(contractPath).abi;

    certificateContract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      wallet
    );
    console.log("Contract initialized at address:", process.env.CONTRACT_ADDRESS);
  } catch (error) {
    console.error("Blockchain initialization error:", error.message);
    throw error;
  }
};

initializeBlockchain();

router.use((req, res, next) => {
  if (!certificateContract) {
    return res.status(500).json({ message: "Blockchain connection not initialized" });
  }
  next();
});

/**
 * @route POST /api/certificates/create
 * @desc Issue a new certificate on the blockchain and save to database
 * @access Public
 */
r// routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { ethers } = require('ethers');

router.post("/create", async (req, res) => {
    try {
        console.log("Request body:", req.body); // Debug log

        const { recipientName, courseName, grade } = req.body;

        // Validate input
        if (!recipientName || !courseName || !grade) {
            return res.status(400).json({ 
                message: "Missing required fields" 
            });
        }

        // Issue certificate on blockchain
        try {
            const tx = await certificateContract.issueCertificate(
                recipientName, 
                courseName, 
                grade
            );
            console.log("Transaction initiated:", tx.hash);

            // Wait for transaction confirmation
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);

            // Create certificate document with hash
            const newCertificate = new Certificate({
                recipientName,
                courseName,
                grade,
                certificateHash: receipt.hash // Make sure this is included
            });

            // Save to database
            const savedCertificate = await newCertificate.save();
            console.log("Saved certificate:", savedCertificate);

            return res.status(201).json({
                message: "Certificate created successfully",
                certificate: savedCertificate,
                transactionHash: receipt.hash
            });

        } catch (contractError) {
            console.error("Blockchain error:", contractError);
            return res.status(500).json({
                message: "Blockchain transaction failed",
                error: contractError.message
            });
        }

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

/**
 * @route GET /api/certificates/getcert
 * @desc Fetch all issued certificates
 * @access Public
 */
router.get("/getcert", async (req, res) => {
  try {
    const certificates = await Certificate.find();
    console.log("Fetched certificates:", certificates);
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route GET /api/certificates/getcert/:id
 * @desc Fetch a specific certificate by ID
 * @access Public
 */
router.get("/getcert/:id", async (req, res) => {
  try {
    console.log("Fetching certificate with ID:", req.params.id); // Debug log
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    console.log("Found certificate:", certificate); // Debug log
    res.status(200).json(certificate);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;