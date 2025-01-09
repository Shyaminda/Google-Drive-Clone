import express from "express";
import asyncHandler from "../utils/handler";
import authMiddleware from "../middleware/authMiddleware";
import { loggedUserController } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get(
	"/authUser",
	authMiddleware(),
	asyncHandler(loggedUserController),
);

export default userRouter;
