import { Router } from "express";
import { db } from "../utils/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authRouter = Router();

authRouter.get("/", (req, res) => {
  return res.json({
    message: "Hello auth",
  });
});

authRouter.post("/register", async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log("User object:", user.email);

    if (!user.email || !user.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const collection = db.collection("users");
    await collection.insertOne(user);

    return res.status(201).json({
      message: "register successful",
    });
  } catch (error) {
    console.log("error", error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Your information is not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Your information is not correct",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );

    return res.json({
      message: "Log in success",
      token,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default authRouter;
