"use client";

import { Logout } from "@/actions/logout";
import { LogoutButtonProps } from "@/types/types";

export const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = async () => {
		await Logout();
	};

	return (
		<span onClick={onClick} className="bg-brand-100 cursor-pointer">
			{children}
		</span>
	);
};
