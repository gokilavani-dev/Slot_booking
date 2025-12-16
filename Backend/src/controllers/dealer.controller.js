import { bookSlot } from "../services/dealerBooking.service.js";

export const dealerBook = async (req, res, next) => {
  try {
    const status = await bookSlot(
      req.body.orderValue,
      req.user.userId
    );
    res.json({ status });
  } catch (e) { next(e); }
};
