"use client";

import Header from "@/components/main/header";
import MobileNavigation from "@/components/main/mobileNavigation";
import Sidebar from "@/components/main/sidebar";
import { useFetchUser } from "@/hooks/fetch-user";
import { Toaster } from "@repo/ui/toaster";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { user } = useFetchUser();
	return (
		<main className="flex h-screen">
			<Sidebar />
			<section className="flex h-full flex-1 flex-col">
				<MobileNavigation {...user} />
				<Header userId={user?.id || ""} accountId={user?.accountId || ""} />
				<div className="main-content">{children}</div>
			</section>
			<Toaster />
		</main>
	);
};

export default Layout;
