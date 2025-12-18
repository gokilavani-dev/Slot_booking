import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    amount: { type: Number, required: true },

    status: { type: String, enum: ["CONFIRMED"], default: "CONFIRMED" },

    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },

    // 🔥 MERGE TRACE
    mergedFrom: [
      { type: mongoose.Schema.Types.ObjectId, ref: "WaitingBooking" }
    ],

    createdByAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
