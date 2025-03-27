import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButtonProps } from "@/types/types";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import Link from "next/link";

export const UserButton = ({ style = "desktop" }: UserButtonProps) => {
	const user = useCurrentUser();

	const buttonClass =
		style === "desktop" ? "sign-out-button" : "mobile-sign-out-button";
	const imageClass = style === "mobile" ? "" : "w-6";

	if (!user) {
		return (
			<Link href="/auth/login">
				<Button className={buttonClass}>
					<h5 className="p-3">SignUp/SignIn</h5>
					{style === "mobile" && <p className="font-medium">Login / Sign Up</p>}
				</Button>
			</Link>
		);
	}

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
