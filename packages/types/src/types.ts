import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email({ message: "Invalid Email" }),
	password: z.string().min(6, { message: "Minimum 6 characters required" }),
	name: z.string().min(1, { message: "Name is required" }),
});

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid Email" }),
	password: z.string().min(1, { message: "Password is required" }),
});
