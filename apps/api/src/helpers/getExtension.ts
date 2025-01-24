export const getExtensionFromFileName = (
	fileName: string,
): string | undefined => {
	const newNameParts = fileName.split(".");
	return newNameParts.length > 1 ? newNameParts.pop() : undefined;
};
