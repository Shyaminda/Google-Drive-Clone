import Header from "@/components/main/header";
import MobileNavigation from "@/components/main/mobileNavigation";
import Sidebar from "@/components/main/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex h-screen">
			<Sidebar />
			<section className="flex h-full flex-1 flex-col">
				<MobileNavigation /> <Header />
				<div className="main-content">{children}</div>
			</section>
		</main>
	);
};

export default Layout;
