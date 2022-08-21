import { Router } from "express";
import { reset } from "nodemon";
import { AuthController } from "../Controller/Auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/api/signup", (req, res) => {
  controller.signup(req, res);
});

router.post("/api/signin", (req, res) => {
  controller.signin(req, res);
});

router.post("/api/password-reset", (req, res) => {
  controller.forgetPassword(req, res);
});

export default router;
