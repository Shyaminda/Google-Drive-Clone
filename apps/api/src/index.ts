import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/auth";
import fileRouter from "./routes/file";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/files", fileRouter);

app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
