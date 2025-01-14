"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@repo/ui/sheet";
import { Separator } from "@repo/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/constants";
import { cn } from "@repo/ui/lib";
import { UserButton } from "@/components/auth/user-button";
import FileUploader from "./fileUploader";

interface MobileNavigationProps {
	id?: string;
	accountId?: string | null;
	name?: string | null;
	image?: string;
	email?: string;
}

const MobileNavigation = ({
	id,
	accountId,
	name,
	image,
	email,
}: MobileNavigationProps) => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	// const { user } = useFetchUser();

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
								src={image || "/assets/images/user-default.jpg"}
								alt="image"
								width={44}
								height={44}
								className="header-user-avatar"
							/>
							<div className="sm:hidden lg:block">
								<p className="subtitle-2 capitalize">{name}</p>
								<p className="caption">{email}</p>
							</div>
						</div>
						<Separator className="mb-4 bg-light-200/20" />
					</SheetTitle>
					<nav className="mobile-nav">
						<ul className="mobile-nav-list">
							{navItems.map(({ url, name, icon }) => (
								<Link key={name} href={url} className="lg:w-full">
									<li
										className={cn(
											"mobile-nav-item",
											pathname === url && "shad-active",
										)}
									>
										<Image
											src={icon}
											alt={name}
											width={24}
											height={24}
											className={cn(
												"nav-icon",
												pathname === url && "nav-icon-active",
											)}
										/>
										<p>{name}</p>
									</li>
								</Link>
							))}
						</ul>
					</nav>
					<Separator className="my-5 bg-light-200/20" />
					<div className="gap-5">
						<FileUploader ownerId={id || ""} accountId={accountId || ""} />
						<UserButton style="mobile" />
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
};

export default MobileNavigation;
