import Order from "../models/Order.js";

export const bookSlot = async (orderValue, dealerId) => {
  const status = orderValue >= 100000 ? "CONFIRMED" : "WAITING";

  await Order.create({
    dealerId,
    orderValue,
    status
  });

  return status;
};
