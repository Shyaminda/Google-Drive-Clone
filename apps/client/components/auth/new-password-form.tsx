"use client";

import { useForm } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { useState, useTransition } from "react";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";
import { newPasswordSchema } from "@repo/types";

export const NewPasswordForm = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const form = useForm<z.infer<typeof newPasswordSchema>>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel="Enter a new password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
			formLabel="Reset password"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder="******"
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						disabled={isPending}
						type="submit"
						className="w-full bg-brand"
					>
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
