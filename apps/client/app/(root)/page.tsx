"use client";

import { Chart } from "@/components/ui/chart";
import { dashboardData } from "@/hooks/fetch-dashboard";
import { useEffect, useState } from "react";

interface DashboardData {
	usedStorage: string;
	maxStorage: string;
	remainingStorage: string;
}

export default function Dashboard() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await dashboardData();
				console.log("storage", response);
				setData(response);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <p>Loading...</p>;
	if (!data) return <p>No data available</p>;

	const usedStorage = parseFloat(data.usedStorage);
	const maxStorage = parseFloat(data.maxStorage);

	return (
		<div className="dashboard-container">
			<section>
				<Chart used={usedStorage} max={maxStorage} />
			</section>
		</div>
	);
}
