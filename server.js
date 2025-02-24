import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Enable CORS to allow requests from your Vercel frontend
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.send("API is up and running!");
});

// POST /api/referrals to handle referral form submissions
app.post("/api/referrals", async (req, res) => {
  try {
    const {
      referrerName,
      referrerEmail,
      friendName,
      friendEmail,
      course,
      message,
    } = req.body;

    // Validate required fields
    if (!referrerName || !referrerEmail || !friendName || !friendEmail || !course) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    // Create referral record
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        friendName,
        friendEmail,
        course,
        message,
      },
    });

    res.status(201).json({
      message: "Referral submitted successfully!",
      referral,
    });
  } catch (error) {
    console.error("Error in /api/referrals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
