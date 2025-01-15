import express from "express";
import asyncHandler from "../utils/handler";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import {
	getFilesController,
	uploadController,
} from "../controllers/file.controller";
import authMiddleware from "../middleware/authMiddleware";

const fileRouter = express.Router();

fileRouter.post("/upload", uploadMiddleware, asyncHandler(uploadController));
fileRouter.get("/files", authMiddleware(), asyncHandler(getFilesController));

export default fileRouter;
