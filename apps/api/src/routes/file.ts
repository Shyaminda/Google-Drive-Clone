import express from "express";
import asyncHandler from "../utils/handler";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import { uploadController } from "../controllers/file.controller";

const fileRouter = express.Router();

fileRouter.post("/upload", uploadMiddleware, asyncHandler(uploadController));

export default fileRouter;
