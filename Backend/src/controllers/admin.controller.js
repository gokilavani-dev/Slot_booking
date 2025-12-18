import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import WaitingBooking from "../models/waiting.model.js";
import Vehicle from "../models/vehicle.model.js";

/* =====================================================
   DEALER MANAGEMENT
===================================================== */

export const createDealer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email & password required" });
  }

  const exists = await User.findOne({
    email: String(email).toLowerCase().trim()
  });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const dealer = await User.create({
    email: String(email).toLowerCase().trim(),
    password: hash,
    role: "DEALER"
  });

  res.status(201).json({
    message: "Dealer created",
    dealer: { id: dealer._id, email: dealer.email }
  });
};

export const listDealers = async (req, res) => {
  const dealers = await User.find({ role: "DEALER" })
    .select("_id email createdAt");
  res.json({ dealers });
};

export const updateDealer = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const dealer = await User.findOne({ _id: id, role: "DEALER" });
  if (!dealer) {
    return res.status(404).json({ message: "Dealer not found" });
  }

  if (email) {
    dealer.email = String(email).toLowerCase().trim();
  }
  if (password) {
    dealer.password = await bcrypt.hash(password, 10);
  }

  await dealer.save();
  res.json({ message: "Dealer updated" });
};

export const deleteDealer = async (req, res) => {
  const { id } = req.params;

  const dealer = await User.findOne({ _id: id, role: "DEALER" });
  if (!dealer) {
    return res.status(404).json({ message: "Dealer not found" });
  }

  await dealer.deleteOne();
  res.json({ message: "Dealer deleted" });
};

/* =====================================================
   BOOKINGS (CONFIRMED ONLY)
===================================================== */

export const listAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .populate("dealerId", "email role")
    .populate("vehicleId", "name");

  res.json({ bookings });
};

/* =====================================================
   WAITING LIST (SEPARATE COLLECTION)
===================================================== */

export const waitingList = async (req, res) => {
  const waiting = await WaitingBooking.find({ merged: false })
    .sort({ createdAt: 1 })
    .populate("dealerId", "email");

  res.json({ waiting });
};

/* =====================================================
   VEHICLE MANAGEMENT
===================================================== */

export const createVehiclesIfEmpty = async (req, res) => {
  const count = await Vehicle.countDocuments();
  if (count > 0) {
    return res.json({ message: "Vehicles already exist" });
  }

  await Vehicle.insertMany([
    { name: "Vehicle 1", tripsPerDay: 4 },
    { name: "Vehicle 2", tripsPerDay: 4 },
    { name: "Vehicle 3", tripsPerDay: 4 },
    { name: "Vehicle 4", tripsPerDay: 4 }
  ]);

  res.json({ message: "Vehicles created" });
};

export const listVehicles = async (req, res) => {
  const vehicles = await Vehicle.find()
    .select("_id name tripsPerDay");

  res.json({ vehicles });
};

/* =====================================================
   MERGE WAITING → CONFIRMED (ADMIN POWER)
===================================================== */

export const mergeBookings = async (req, res) => {
  const { waitingIds, vehicleId } = req.body;

  if (!Array.isArray(waitingIds) || waitingIds.length < 2) {
    return res.status(400).json({
      message: "Select at least 2 waiting bookings"
    });
  }

  if (!vehicleId) {
    return res.status(400).json({
      message: "vehicleId required"
    });
  }

  const waitings = await WaitingBooking.find({
    _id: { $in: waitingIds },
    merged: false
  }).populate("dealerId", "email");

  if (waitings.length !== waitingIds.length) {
    return res.status(400).json({
      message: "Invalid or already merged waiting bookings"
    });
  }

  // same date + slot validation
  const date = waitings[0].date;
  const slot = waitings[0].slot;

  const same = waitings.every(
    w => w.date === date
  );

  if (!same) {
    return res.status(400).json({
      message: "All waiting bookings must have same date"
    });
  }

  const total = waitings.reduce((sum, w) => sum + w.amount, 0);

  if (total < 100000) {
    return res.status(400).json({
      message: "Combined amount must be at least ₹1,00,000"
    });
  }

  // ✅ create CONFIRMED booking
  const booking = await Booking.create({
    dealerId: waitings[0].dealerId._id, // reference dealer
    date,
    slot,
    amount: total,
    vehicleId,
    status: "CONFIRMED",
    createdByAdmin: true
  });

  // ✅ mark waiting bookings as merged
  await WaitingBooking.updateMany(
    { _id: { $in: waitingIds } },
    {
      $set: {
        merged: true,
        mergedInto: booking._id
      }
    }
  );

  res.json({
    message: "Merged and confirmed successfully",
    bookingId: booking._id,
    totalAmount: total
  });
};
