"use client";

import { Logout } from "@/actions/logout";

interface LogoutButtonProps {
	children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = () => {
		Logout();
	};

	return (
		<span onClick={onClick} className="bg-brand-100 cursor-pointer">
			{children}
		</span>
	);
};
