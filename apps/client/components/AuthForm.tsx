"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FormType = "login" | "signUp";

const authFormSchema = (formType: FormType) => {
	return z.object({
		email: z.string().email(),
		fullName:
			formType === "signUp" ? z.string().min(3).max(20) : z.string().optional(),
	});
};

const AuthForm = ({ type }: { type: FormType }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const formSchema = authFormSchema(type);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};
	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
					<h1 className="form-title">
						{type === "login" ? "Login" : "Sign Up"}
					</h1>
					{type === "signUp" && (
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<div className="shad-form-item">
										<FormLabel className="shad-form-label">Full Name</FormLabel>
										<FormControl>
											<Input
												className="shad-input"
												placeholder="Enter your full name"
												{...field}
											/>
										</FormControl>
									</div>
									<FormMessage className="shad-form-message" />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="shad-form-item">
									<FormLabel className="shad-form-label">Email</FormLabel>
									<FormControl>
										<Input
											className="shad-input"
											placeholder="Enter your Email"
											{...field}
										/>
									</FormControl>
								</div>
								<FormMessage className="shad-form-message" />
							</FormItem>
						)}
					/>
					<Button
						className="form-submit-button"
						type="submit"
						disabled={isLoading}
					>
						{type === "login" ? "Login" : "Sign Up"}

						{isLoading && (
							<Image
								src="/assets/icons/loader.svg"
								alt="loader"
								width={24}
								height={24}
								className="animate-spin ml-2"
							/>
						)}
					</Button>

					{errorMessage && <p className="error-message">*{errorMessage}</p>}

					<div className="body-2 flex justify-center">
						<p className="text-light-100">
							{type === "login"
								? "Don't have an account?"
								: "Already have an account?"}
						</p>
						<Link
							href={type === "login" ? "/sign-up" : "/login"}
							className="ml-1 font-medium text-brand"
						>
							{type === "login" ? "sign Up" : "login"}
						</Link>
					</div>
				</form>
			</Form>
		</div>
	);
};
export default AuthForm;
