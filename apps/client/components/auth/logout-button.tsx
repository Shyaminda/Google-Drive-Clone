"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
	children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = () => {
		logout();
	};

	return (
		<span onClick={onClick} className="bg-brand-100 cursor-pointer">
			{children}
		</span>
	);
};
