import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend from /Public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../../Public")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../../Public/login.html")));

// Routes
app.use("/auth", authRoutes);
app.use("/dealer", dealerRoutes);
app.use("/admin", adminRoutes);

// Error handler
app.use(errorHandler);

export default app;
