import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

export default Router().post("/login", login);
