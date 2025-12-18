import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },              // "YYYY-MM-DD"
    slot: { type: String, required: true },              // "8-12" | "12-4" | "4-8"
    amount: { type: Number, required: true },

    status: { type: String, enum: ["CONFIRMED"],  default: "CONFIRMED" },
    merged: { type: Boolean, default: false },
    mergedInto: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },

    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },

    // for audit
    createdByAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
