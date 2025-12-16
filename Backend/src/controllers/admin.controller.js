import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";

export const createDealer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email & password required" });

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);

  const dealer = await User.create({
    email: String(email).toLowerCase().trim(),
    password: hash,
    role: "dealer"
  });

  res.status(201).json({ message: "Dealer created", dealer: { id: dealer._id, email: dealer.email } });
};

export const listDealers = async (req, res) => {
  const dealers = await User.find({ role: "dealer" }).select("_id email createdAt");
  res.json({ dealers });
};

export const updateDealer = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const dealer = await User.findOne({ _id: id, role: "dealer" });
  if (!dealer) return res.status(404).json({ message: "Dealer not found" });

  if (email) dealer.email = String(email).toLowerCase().trim();
  if (password) dealer.password = await bcrypt.hash(password, 10);

  await dealer.save();
  res.json({ message: "Dealer updated" });
};

export const deleteDealer = async (req, res) => {
  const { id } = req.params;
  const dealer = await User.findOne({ _id: id, role: "dealer" });
  if (!dealer) return res.status(404).json({ message: "Dealer not found" });

  await dealer.deleteOne();
  res.json({ message: "Dealer deleted" });
};

export const listAllBookings = async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 }).populate("dealerId", "email role");
  res.json({ bookings });
};

export const waitingList = async (req, res) => {
  const bookings = await Booking.find({ status: "waiting", merged: false })
    .sort({ createdAt: 1 })
    .populate("dealerId", "email");
  res.json({ bookings });
};

export const createVehiclesIfEmpty = async (req, res) => {
  const count = await Vehicle.countDocuments();
  if (count > 0) return res.json({ message: "Vehicles already exist" });

  // 4 vehicles default
  await Vehicle.insertMany([
    { name: "Vehicle 1", tripsPerDay: 4 },
    { name: "Vehicle 2", tripsPerDay: 4 },
    { name: "Vehicle 3", tripsPerDay: 4 },
    { name: "Vehicle 4", tripsPerDay: 4 }
  ]);

  res.json({ message: "Vehicles created" });
};

export const listVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().select("_id name tripsPerDay");
  res.json({ vehicles });
};

/**
 * Merge waiting bookings:
 * - same date + slot
 * - selected bookingIds (>=2)
 * - combined amount >= 100000 => create one CONFIRMED booking
 * - mark originals: merged=true, mergedInto=newBookingId
 * - assign vehicleId required (admin permission)
 */
export const mergeBookings = async (req, res) => {
  const { bookingIds, vehicleId } = req.body;
  if (!Array.isArray(bookingIds) || bookingIds.length < 2) {
    return res.status(400).json({ message: "Select at least 2 bookings" });
  }
  if (!vehicleId) return res.status(400).json({ message: "vehicleId required" });

  const bookings = await Booking.find({ _id: { $in: bookingIds } }).populate("dealerId", "email");
  if (bookings.length !== bookingIds.length) return res.status(400).json({ message: "Some bookings not found" });

  // validate waiting + not merged
  for (const b of bookings) {
    if (b.status !== "waiting" || b.merged) {
      return res.status(400).json({ message: "Only unmerged waiting bookings can be merged" });
    }
  }

  const date = bookings[0].date;
  const slot = bookings[0].slot;
  const same = bookings.every(b => b.date === date && b.slot === slot);
  if (!same) return res.status(400).json({ message: "All selected bookings must be same date & slot" });

  const total = bookings.reduce((s, b) => s + b.amount, 0);
  if (total < 100000) {
    return res.status(400).json({ message: "Combined amount must be >= 100000 to confirm" });
  }

  // create merged confirmed booking (dealerId = first dealer for reference)
  const mergedBooking = await Booking.create({
    dealerId: bookings[0].dealerId._id,
    date,
    slot,
    amount: total,
    status: "confirmed",
    vehicleId,
    createdByAdmin: true
  });

  // mark originals merged
  await Booking.updateMany(
    { _id: { $in: bookingIds } },
    { $set: { merged: true, mergedInto: mergedBooking._id } }
  );

  res.json({
    message: "Merged and confirmed",
    mergedBookingId: mergedBooking._id,
    totalAmount: total
  });
};
