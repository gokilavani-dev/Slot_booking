import Booking from "../models/booking.model.js";

export const createBooking = async (req, res) => {
  const { date, slot, amount } = req.body;
  const dealerId = req.user.userId;

  if (!date || !slot || !amount) return res.status(400).json({ message: "date, slot, amount required" });

  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) return res.status(400).json({ message: "Invalid amount" });

  const status = amt >= 100000 ? "confirmed" : "waiting";

  const booking = await Booking.create({
    dealerId,
    date,
    slot,
    amount: amt,
    status
  });

  res.status(201).json({ message: "Booking created", booking });
};

export const myBookings = async (req, res) => {
  const dealerId = req.user.userId;
  const bookings = await Booking.find({ dealerId }).sort({ createdAt: -1 });
  res.json({ bookings });
};
