export interface File {
	id: string;
	name: string;
	url: string;
	type: string;
	bucketField: string;
	accountId: string;
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
	accountId: string;
	className?: string;
}

export interface MobileNavigationProps {
	id?: string;
	accountId?: string | null;
	name?: string | null;
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
	type: string;
	extension: string;
	bucketField: string;
	url: string;
	imageClassName?: string;
	className?: string;
}

export interface User {
	id: string;
	email: string;
	name: string | null;
	emailVerified: string | null;
	image: string;
	password: string;
	accountId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CardProps {
	file: File;
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
