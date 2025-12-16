import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderValue: Number,
  status: { type: String, enum: ["WAITING", "CONFIRMED"] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
