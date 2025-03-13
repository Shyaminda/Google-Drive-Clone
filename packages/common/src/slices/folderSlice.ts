import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Folder {
	id: string;
	name: string;
}

interface FolderState {
	openedFolder: Folder | null;
}

const initialState: FolderState = {
	openedFolder: null,
};

const folderSlice = createSlice({
	name: "folder",
	initialState,
	reducers: {
		setOpenedFolder: (state, action: PayloadAction<Folder | null>) => {
			state.openedFolder = action.payload;
		},
	},
});

export const { setOpenedFolder } = folderSlice.actions;
export const openedFolder = (state: { folder: FolderState }) =>
	state.folder.openedFolder;
export default folderSlice.reducer;

//Todo: add eslint for common
