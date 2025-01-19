import { LogoutButton } from "@/components/auth/logout-button";
import { UserButtonProps } from "@/types/types";
import { Button } from "@repo/ui/button";
import Image from "next/image";

export const UserButton = ({ style = "desktop" }: UserButtonProps) => {
	const buttonClass =
		style === "desktop" ? "sign-out-button" : "mobile-sign-out-button";
	const imageClass = style === "mobile" ? "" : "w-6";
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
				{style === "mobile" && <p className="font-medium">Logout</p>}
			</Button>
		</LogoutButton>
	);
};
