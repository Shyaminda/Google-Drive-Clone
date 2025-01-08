import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@repo/ui/button";
import Image from "next/image";

export const UserButton = () => {
	const user = useCurrentUser();

	return (
		<LogoutButton>
			<Button className="sign-out-button">
				<Image
					src="/assets/icons/logout.svg"
					alt="logo"
					width={24}
					height={24}
					className="w-6"
				/>
			</Button>
		</LogoutButton>
	);
};
