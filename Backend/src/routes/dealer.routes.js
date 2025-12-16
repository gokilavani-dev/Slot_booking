import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createBooking, myBookings } from "../controllers/dealer.controller.js";

const router = Router();

router.post("/book", auth, createBooking);
router.get("/bookings", auth, myBookings);

export default router;
