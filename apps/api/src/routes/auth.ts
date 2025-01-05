import express from "express";
import { registerController } from "../controllers/auth.controller";
import asyncHandler from "../utils/handler";
import { authenticateUser } from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post(
	"/register",
	authenticateUser,
	asyncHandler(registerController),
);

export default authRouter;
