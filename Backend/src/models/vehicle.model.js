import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tripsPerDay: { type: Number, default: 4 } // 4 trips/day
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
