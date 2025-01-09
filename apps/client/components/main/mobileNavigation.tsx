"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@repo/ui/sheet";
import { usePathname } from "next/navigation";
import { useFetchUser } from "@/hooks/fetch-user";

const MobileNavigation = () => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const { user } = useFetchUser();

	return (
		<header className="mobile-header">
			<Image
				src="/assets/icons/logo-full-brand.svg"
				alt="logo"
				width={120}
				height={52}
				className="h-auto"
			/>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger>
					<Image
						src="/assets/icons/menu.svg"
						alt="search"
						width={30}
						height={30}
					/>
				</SheetTrigger>
				<SheetContent className="shad-sheet h-screen px-3">
					<SheetTitle>
						<div className="header-user">
							<Image
								src={user?.avatar || "/assets/images/user-default.jpg"}
								alt="avatar"
								width={44}
								height={44}
								className="header-user-avatar"
							/>
							<div className="sm:hidden lg:block">
								<p className="subtitle-2 capitalize">{user?.name}</p>
							</div>
						</div>
					</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</SheetDescription>
				</SheetContent>
			</Sheet>
		</header>
	);
};

export default MobileNavigation;
