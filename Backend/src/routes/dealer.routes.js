import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { dealerBook } from "../controllers/dealer.controller.js";

export default Router()
  .post("/book-slot", requireAuth, dealerBook);
