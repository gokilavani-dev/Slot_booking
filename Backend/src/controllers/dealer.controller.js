import Booking from "../models/booking.model.js";
import WaitingBooking from "../models/waiting.model.js";

export const createBooking = async (req, res) => {
  const { date, slot, amount } = req.body;
  const dealerId = req.user.userId;

  if (!date || !slot || !amount) {
    return res.status(400).json({ message: "date, slot, amount required" });
  }

  const amt = Number(amount);

  // ❌ Below 20k → reject
  if (Number.isNaN(amt) || amt < 20000) {
    return res.status(400).json({
      message: "Minimum booking amount is ₹20,000"
    });
  }

  // ✅ DIRECT CONFIRMED
  if (amt >= 100000) {
    const booking = await Booking.create({
      dealerId,
      date,
      slot,
      amount: amt,
      status: "CONFIRMED"
    });

    return res.status(201).json({
      status: "CONFIRMED",
      booking
    });
  }

  // 🕒 WAITING LIST
  const waiting = await WaitingBooking.create({
    dealerId,
    date,
    slot,
    amount: amt
  });

  res.status(201).json({
    status: "WAITING",
    waiting
  });
};
