export interface File {
	id: string;
	name: string;
	url: string;
	type: string;
	bucketField: string;
	ownerId: string;
	owner: User;
	extension: string;
	size: number;
	user: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface SearchParamProps {
	params: {
		type: string;
		limit?: string;
		sort?: string;
		searchText?: string;
	};
}

export interface BackButtonProps {
	label: string;
	href: string;
}

export interface HeaderProps {
	label: string;
	formLabel: string;
}

export interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	formLabel: string;
	showSocial?: boolean;
}

export interface LogoutButtonProps {
	children?: React.ReactNode;
}

export interface UserButtonProps {
	style?: "desktop" | "mobile";
}

export interface FileUploaderProps {
	ownerId: string;
	className?: string;
}

export interface MobileNavigationProps {
	id?: string;
	name: string;
	image?: string;
	email?: string;
}

export interface FormErrorProps {
	message?: string;
}

export interface FormSuccessProps {
	message?: string;
}

export interface ThumbnailProps {
	id?: string;
	type: string;
	extension: string;
	bucketField?: string;
	imageClassName?: string;
	className?: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	emailVerified: string | null;
	image: string;
	password: string;
	createdAt: string;
	updatedAt: string;
}

export interface CardProps {
	file: File;
	onClick: () => void;
}

export interface ListViewProps {
	file: File[];
	onClick?: () => void;
}

export interface FileType {
	IMAGE: string;
	DOCUMENT: string;
	AUDIO: string;
	VIDEO: string;
}

export interface DropDownProps {
	file: File;
}

export interface ActionType {
	label: string;
	icon: string;
	value: string;
}

export interface DetailsProps {
	file: File;
}

export interface ShareFileProps {
	file: File;
	onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
	onRemove: (email: string) => void;
	onPermissionChange: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface SortProps {
	file: File[];
}

export interface FileCategorySummaryProps {
	size: number;
	latestDate: string;
}

export interface DashboardFileProps {
	id: string;
	name: string;
	type: string;
	size: string;
	url: string;
	createdAt: string;
	bucketField: string;
	extension: string;
	file: File;
}

export interface DashboardDataProps {
	usedStorage: string;
	maxStorage: string;
	remainingStorage: string;
	summary: {
		Documents: FileCategorySummaryProps;
		Images: FileCategorySummaryProps;
		Videos: FileCategorySummaryProps;
		Audios: FileCategorySummaryProps;
		Others: FileCategorySummaryProps;
	};
	recentFiles: File[];
}

export interface viewOnlyProps {
	id: string;
	bucketField: string;
	type: string;
	name: string;
}

export interface FileViewerProps {
	bucketField: string;
	fileType: string;
	id: string;
	fileName: string;
	onClose: () => void;
}
