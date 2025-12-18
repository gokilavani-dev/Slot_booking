import mongoose from "mongoose";

const waitingSchema = new mongoose.Schema(
  {
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: String,
    slot: String,
    amount: Number,
    merged: { type: Boolean, default: false },
    mergedInto: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }
  },
  { timestamps: true }
);

export default mongoose.model("WaitingBooking", waitingSchema);
