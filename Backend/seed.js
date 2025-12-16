import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// 👇 correct relative import
import User from "./src/models/User.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash("123456", 10);

  await User.deleteMany(); // optional reset

  await User.create([
    { email: "admin@test.com", password: hash, role: "ADMIN" },
    { email: "dealer@test.com", password: hash, role: "DEALER" }
  ]);

  console.log("✅ Admin & Dealer created");
  process.exit();
}

seed();
