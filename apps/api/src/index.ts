import express from "express";
import authRouter from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
