"use client";

import { FaGithub } from "react-icons/fa";
import { Button } from "@repo/ui/button";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const Social = () => {
	const searchparams = useSearchParams();
	const callbackUrl = searchparams.get("callbackUrl");

	const onClick = (provider: "google" | "github") => {
		signIn(provider, {
			callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});
	};
	return (
		<div className="flex items-center gap-x-2">
			<Button
				className="w-full"
				size="lg"
				variant="outline"
				onClick={() => onClick("google")}
			>
				<FcGoogle className="h-5 w-5" />
			</Button>
			<Button
				className="w-full"
				size="lg"
				variant="outline"
				onClick={() => onClick("github")}
			>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	);
};
