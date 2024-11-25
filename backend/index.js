import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import dotenv from "dotenv";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS with fallback for CLIENT_URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow all origins if CLIENT_URL is not set
    credentials: true,
  })
);

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Initialize ImageKit
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// API route for ImageKit authentication
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Create a new chat
app.post(
  "/api/chats",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
      const newChat = new Chat({
        userId,
        history: [{ role: "user", parts: [{ text }] }],
      });

      const savedChat = await newChat.save();

      const userChats = await UserChats.find({ userId });
      if (!userChats.length) {
        const newUserChats = new UserChats({
          userId,
          chats: [
            {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          ],
        });

        await newUserChats.save();
      } else {
        await UserChats.updateOne(
          { userId },
          {
            $push: {
              chats: {
                _id: savedChat._id,
                title: text.substring(0, 40),
              },
            },
          }
        );
      }

      res.status(201).send(savedChat._id);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating chat!");
    }
  }
);

// Fetch user chats
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0]?.chats || []);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user chats!");
  }
});

// Fetch a specific chat
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chat!");
  }
});

// Add conversation to a chat
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding conversation!");
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
