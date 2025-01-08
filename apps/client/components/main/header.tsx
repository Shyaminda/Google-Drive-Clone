"use client";

import React from "react";
import { UserButton } from "@/components/auth/user-button";
import Search from "@/components/main/search";
import FileUploader from "@/components/main/fileUploader";

const Header = () => {
	return (
		<header className="header">
			<Search />
			<div className="header-wrapper">
				<FileUploader />
				<form>
					<UserButton />
				</form>
			</div>
		</header>
	);
};

export default Header;
