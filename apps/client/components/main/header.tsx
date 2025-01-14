"use client";

import React from "react";
import { UserButton } from "@/components/auth/user-button";
import Search from "@/components/main/search";
import FileUploader from "@/components/main/fileUploader";

const Header = ({
	userId,
	accountId,
}: {
	userId: string;
	accountId: string;
}) => {
	return (
		<header className="header">
			<Search />
			<div className="header-wrapper">
				<FileUploader ownerId={userId} accountId={accountId} />
				<form>
					<UserButton />
				</form>
			</div>
		</header>
	);
};

export default Header;
