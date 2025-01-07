"use client";

import { UserButton } from "@/components/auth/user-button";

export default function Home() {
	return (
		<div className="flex-center h-screen">
			<h1 className="h1"> Driveway - The best storage solution</h1>
			<UserButton />
		</div>
	);
}
