import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import authRoutes from "./routes/auth.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";
import { errorHandler } from "./middlewares/err.middleware.js";
import User from "./models/User.model.js";

const app = express();

app.use(cors());
app.use(express.json());

// ===== FRONTEND SERVE =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../Public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Public/login.html"));
});

// ===== ONE-TIME ADMIN CREATION =====
app.get("/__create-admin", async (req, res) => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) {
      return res.status(200).json({ message: "Admin already exists" });
    }

    const hash = await bcrypt.hash("Admin@123", 10);

    await User.create({
      email: "admin@bookyours.com",
      password: hash,
      role: "admin",
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== ROUTES =====
app.use("/auth", authRoutes);
app.use("/dealer", dealerRoutes);

// ===== ERROR HANDLER =====
app.use(errorHandler);

export default app;
