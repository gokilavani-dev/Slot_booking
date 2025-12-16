import { loginService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    res.json(await loginService(req.body.email, req.body.password));
  } catch (e) { next(e); }
};
