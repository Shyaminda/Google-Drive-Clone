import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@repo/ui/global";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import BlobUrlCleanup from "@/helpers/revokeUrls";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "DriveWay",
	description: "Best storage solution for any type of file",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html lang="en">
				<body className={`${poppins.variable} font-poppins antialiased`}>
					<BlobUrlCleanup />
					{children}
				</body>
			</html>
		</SessionProvider>
	);
}
