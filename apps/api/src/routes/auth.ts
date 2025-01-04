import express from "express";
import { registerController } from "../controllers/auth.controller";
import asyncHandler from "../utils/handler";

const authRouter = express.Router();

authRouter.post("/register", asyncHandler(registerController));

export default authRouter;
