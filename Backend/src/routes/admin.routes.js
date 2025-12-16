import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import {
  createDealer, listDealers, updateDealer, deleteDealer,
  listAllBookings, waitingList,
  mergeBookings, createVehiclesIfEmpty, listVehicles
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/dealers", auth, adminOnly, createDealer);
router.get("/dealers", auth, adminOnly, listDealers);
router.put("/dealers/:id", auth, adminOnly, updateDealer);
router.delete("/dealers/:id", auth, adminOnly, deleteDealer);

router.get("/bookings", auth, adminOnly, listAllBookings);
router.get("/waiting", auth, adminOnly, waitingList);

router.post("/merge", auth, adminOnly, mergeBookings);

router.post("/vehicles/init", auth, adminOnly, createVehiclesIfEmpty);
router.get("/vehicles", auth, adminOnly, listVehicles);

export default router;
