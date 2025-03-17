import { DashboardDataProps, FileType } from "@/types/types";

/* eslint-disable indent */
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const convertFileSize = (sizeInBytes: number, digits?: number) => {
	if (sizeInBytes < 1024) {
		return sizeInBytes + " Bytes"; // Less than 1 KB, show in Bytes
	} else if (sizeInBytes < 1024 * 1024) {
		const sizeInKB = sizeInBytes / 1024;
		return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
	} else if (sizeInBytes < 1024 * 1024 * 1024) {
		const sizeInMB = sizeInBytes / (1024 * 1024);
		return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
	} else {
		const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
		return sizeInGB.toFixed(digits || 2) + " GB"; // 1 GB or more, show in GB
	}
};

export const calculateAngle = (sizeInBytes: number) => {
	const totalSizeInBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
	const percentage = (sizeInBytes / totalSizeInBytes) * 360;
	return Number(percentage.toFixed(2));
};

export const calculatePercentage = (sizeInBytes: number) => {
	const totalSizeInBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
	const percentage = (sizeInBytes / totalSizeInBytes) * 100;
	return Number(percentage.toFixed(1));
};

export const getFileType = (fileName: string) => {
	const extension = fileName.split(".").pop()?.toLowerCase();

	if (!extension) return { type: "other", extension: "" };

	const documentExtensions = [
		"pdf",
		"doc",
		"docx",
		"txt",
		"xls",
		"xlsx",
		"csv",
		"rtf",
		"ods",
		"ppt",
		"odp",
		"md",
		"html",
		"htm",
		"epub",
		"pages",
		"fig",
		"psd",
		"ai",
		"indd",
		"xd",
		"sketch",
		"afdesign",
		"afphoto",
		"afphoto",
	];
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
	const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
	const audioExtensions = ["mp3", "wav", "ogg", "flac"];

	if (documentExtensions.includes(extension))
		return { type: "document", extension };
	if (imageExtensions.includes(extension)) return { type: "image", extension };
	if (videoExtensions.includes(extension)) return { type: "video", extension };
	if (audioExtensions.includes(extension)) return { type: "audio", extension };

	return { type: "other", extension };
};

export const formatDateTime = (isoString: string | null | undefined) => {
	if (!isoString) return "—";

	const date = new Date(isoString);

	// Get hours and adjust for 12-hour format
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const period = hours >= 12 ? "pm" : "am";

	// Convert hours to 12-hour format
	hours = hours % 12 || 12;

	// Format the time and date parts
	const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
	const day = date.getDate();
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = monthNames[date.getMonth()];

	return `${time}, ${day} ${month}`;
};

export const getFolderIcon = (type: string) => {
	switch (type) {
		case "DOCUMENT":
			return "/assets/icons/folder-document.png";
		case "IMAGE":
			return "/assets/icons/folder-image.png";
		case "VIDEO":
			return "/assets/icons/folder-video.png";
		case "AUDIO":
			return "/assets/icons/folder-audio.png";
		default:
			return "/assets/icons/folder-other.png";
	}
};

export const getFileIcon = (
	extension: string | undefined,
	type: FileType | string,
) => {
	switch (extension) {
		// Document
		case "pdf":
			return "/assets/icons/file-pdf.svg";
		case "doc":
			return "/assets/icons/file-doc.svg";
		case "docx":
			return "/assets/icons/file-docx.svg";
		case "csv":
			return "/assets/icons/file-csv.svg";
		case "txt":
			return "/assets/icons/file-txt.svg";
		case "xls":
		case "xlsx":
			return "/assets/icons/file-document.svg";
		// Image
		case "svg":
			return "/assets/icons/file-image.svg";
		case "jpg":
			return "/assets/icons/file-image.svg";
		case "jpeg":
			return "/assets/icons/file-image.svg";
		// Video
		case "mkv":
		case "mov":
		case "avi":
		case "wmv":
		case "mp4":
		case "flv":
		case "webm":
		case "m4v":
		case "3gp":
			return "/assets/icons/file-video.svg";
		// Audio
		case "mp3":
		case "mpeg":
		case "wav":
		case "aac":
		case "flac":
		case "ogg":
		case "wma":
		case "m4a":
		case "aiff":
		case "alac":
			return "/assets/icons/file-audio.svg";

		default:
			switch (type) {
				case "IMAGE":
					return "/assets/icons/file-image.svg";
				case "DOCUMENT":
					return "/assets/icons/file-document.svg";
				case "VIDEO":
					return "/assets/icons/file-video.svg";
				case "AUDIO":
					return "/assets/icons/file-audio.svg";
				default:
					return "/assets/icons/file-other.svg";
			}
	}
};

// APPWRITE URL UTILS
// Construct appwrite file URL - https://appwrite.io/docs/apis/rest#images
export const constructFileUrl = (bucketFileId: string) => {
	return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
	return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

// DASHBOARD UTILS
export const getUsageSummary = (summary: DashboardDataProps["summary"]) => {
	return [
		{
			title: "Documents",
			size: summary.Documents.size,
			latestDate: summary.Documents.latestDate,
			icon: "/assets/icons/file-document-light.svg",
			url: "/documents",
		},
		{
			title: "Images",
			size: summary.Images.size,
			latestDate: summary.Images.latestDate,
			icon: "/assets/icons/file-image-light.svg",
			url: "/images",
		},
		{
			title: "Videos",
			size: summary.Videos.size,
			latestDate: summary.Videos.latestDate,
			icon: "/assets/icons/file-video-light.svg",
			url: "/videos",
		},
		{
			title: "Audios",
			size: summary.Audios.size,
			latestDate: summary.Audios.latestDate,
			icon: "/assets/icons/file-audio-light.svg",
			url: "/audios",
		},
		{
			title: "Others",
			size: summary.Others.size,
			latestDate: summary.Others.latestDate,
			icon: "/assets/icons/file-other-light.svg",
			url: "/others",
		},
	];
};

export const getFileTypesParams = (type: string) => {
	switch (type) {
		case "documents":
			return ["DOCUMENT"];
		case "images":
			return ["IMAGE"];
		case "audios":
			return ["AUDIO"];
		case "videos":
			return ["VIDEO"];
		case "others":
			return ["OTHER"];
		default:
			return ["DOCUMENT", "IMAGE", "AUDIO", "VIDEO", "OTHER"];
	}
};

export const fileExtensions = {
	document: [
		"pdf",
		"doc",
		"docx",
		"txt",
		"xls",
		"xlsx",
		"csv",
		"rtf",
		"ods",
		"ppt",
		"odp",
		"md",
		"html",
		"htm",
		"epub",
		"pages",
		"fig",
		"psd",
		"ai",
		"indd",
		"xd",
		"sketch",
		"afdesign",
		"afphoto",
	],
	image: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
	video: ["mp4", "avi", "mov", "mkv", "webm"],
	audio: ["mp3", "wav", "ogg", "flac"],
	other: [
		"txt",
		"log",
		"json",
		"xml",
		"csv",
		"md",
		"html",
		"htm",
		"zip",
		"rar",
		"tar",
		"gz",
		"bz2",
		"iso",
		"apk",
		"exe",
		"msi",
		"ico",
	],
};

export const getVideoMimeType = (extension: string) => {
	const mimeTypes: { [key: string]: string } = {
		mp4: "video/mp4",
		avi: "video/x-msvideo",
		mov: "video/quicktime",
		mkv: "video/x-matroska",
		webm: "video/webm",
	};
	return mimeTypes[extension] || "video/mp4";
};

export const getAudioMimeType = (extension: string) => {
	const mimeTypes: Record<string, string> = {
		mp3: "audio/mpeg",
		wav: "audio/wav",
		ogg: "audio/ogg",
		flac: "audio/flac",
	};
	return mimeTypes[extension] || "audio/mpeg";
};

export const getDocumentMimeType = (extension: string) => {
	const mimeTypes: Record<string, string> = {
		pdf: "application/pdf",
		doc: "application/msword",
		docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		txt: "text/plain",
		xls: "application/vnd.ms-excel",
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		csv: "text/csv",
		rtf: "application/rtf",
		ods: "application/vnd.oasis.opendocument.spreadsheet",
		ppt: "application/vnd.ms-powerpoint",
		odp: "application/vnd.oasis.opendocument.presentation",
		md: "text/markdown",
		html: "text/html",
		htm: "text/html",
		epub: "application/epub+zip",
		pages: "application/vnd.apple.pages",
		fig: "application/x-dxf",
		psd: "image/vnd.adobe.photoshop",
		ai: "application/postscript",
		indd: "application/x-indesign",
		xd: "application/xd",
		sketch: "application/sketch",
		afdesign: "application/x-affinity-designer",
		afphoto: "application/x-affinity-photo",
	};
	return mimeTypes[extension] || "";
};

export const getOtherMimeType = (extension: string) => {
	const mimeTypes: Record<string, string> = {
		txt: "text/plain",
		log: "text/plain",
		json: "application/json",
		xml: "application/xml",
		csv: "text/csv",
		md: "text/markdown",
		html: "text/html",
		htm: "text/html",
		zip: "application/zip",
		rar: "application/x-rar-compressed",
		tar: "application/x-tar",
		gz: "application/gzip",
		bz2: "application/x-bzip2",
		iso: "application/x-iso9660-image",
		apk: "application/vnd.android.package-archive",
		exe: "application/x-msdownload",
		msi: "application/x-msi",
		ico: "image/x-icon",
	};
	return mimeTypes[extension] || "";
};
