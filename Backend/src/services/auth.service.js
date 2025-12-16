import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid login");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid login");

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  };
};
