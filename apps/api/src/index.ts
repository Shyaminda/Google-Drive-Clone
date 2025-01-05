import express from "express";
import authRouter from "./routes/auth";
import { ExpressAuth } from "@auth/express";
import Credentials from "@auth/express/providers/credentials";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth/*", ExpressAuth({ providers: [Credentials] }));

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
