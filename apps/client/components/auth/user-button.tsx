import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@repo/ui/button";
import Image from "next/image";

interface UserButtonProps {
	type?: "desktop" | "mobile";
}

export const UserButton = ({ type = "desktop" }: UserButtonProps) => {
	const buttonClass =
		type === "desktop" ? "sign-out-button" : "mobile-sign-out-button";
	const imageClass = type === "mobile" ? "" : "w-6";
	return (
		<LogoutButton>
			<Button className={buttonClass}>
				<Image
					src="/assets/icons/logout.svg"
					alt="logo"
					width={24}
					height={24}
					className={imageClass}
				/>
				{type === "mobile" && <p className="font-medium">Logout</p>}
			</Button>
		</LogoutButton>
	);
};
