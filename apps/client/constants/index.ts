import { DashboardDataProps } from "@/types/types";

export const navItems = [
	{
		name: "Dashboard",
		icon: "/assets/icons/dashboard.svg",
		url: "/",
	},
	{
		name: "Documents",
		icon: "/assets/icons/documents.svg",
		url: "/documents",
	},
	{
		name: "Images",
		icon: "/assets/icons/images.svg",
		url: "/images",
	},
	{
		name: "Videos",
		icon: "/assets/icons/video.svg",
		url: "/videos",
	},
	{
		name: "Audios",
		icon: "/assets/icons/audio.svg",
		url: "/audios",
	},
	{
		name: "Other",
		icon: "/assets/icons/others.svg",
		url: "/others",
	},
];

export const actionsDropdownItems = [
	{
		label: "Rename",
		icon: "/assets/icons/edit.svg",
		value: "rename",
	},
	{
		label: "Details",
		icon: "/assets/icons/info.svg",
		value: "details",
	},
	{
		label: "Share",
		icon: "/assets/icons/share.svg",
		value: "share",
	},
	{
		label: "Download",
		icon: "/assets/icons/download.svg",
		value: "download",
	},
	{
		label: "Delete",
		icon: "/assets/icons/delete.svg",
		value: "delete",
	},
];

export const actionsDropdownItemsFolder = [
	{
		label: "Rename",
		icon: "/assets/icons/edit.svg",
		value: "rename",
	},
	{
		label: "Delete",
		icon: "/assets/icons/delete.svg",
		value: "delete",
	},
];

export const sortTypes = [
	{
		label: "Name (A-Z)",
		value: "name-asc",
	},
	{
		label: "Name (Z-A)",
		value: "name-desc",
	},
	{
		label: "Newest",
		value: "date-newest",
	},
	{
		label: "Oldest",
		value: "date-oldest",
	},
	{
		label: "Largest",
		value: "size-largest",
	},
	{
		label: "Smallest",
		value: "size-smallest",
	},
];

export const avatarPlaceholderUrl =
	"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const defaultData: DashboardDataProps = {
	usedStorage: "0",
	maxStorage: "5368709120",
	remainingStorage: "5368709120",
	summary: {
		Documents: { size: 0, latestDate: "0" },
		Images: { size: 0, latestDate: "0" },
		Videos: { size: 0, latestDate: "0" },
		Audios: { size: 0, latestDate: "0" },
		Others: { size: 0, latestDate: "0" },
	},
	recentFiles: [],
};
