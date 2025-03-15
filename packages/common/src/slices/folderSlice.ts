import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Folder {
	id: string;
	name: string;
}

interface FolderState {
	openedFolder: Folder | null;
	history: Folder[];
}

const initialState: FolderState = {
	openedFolder: null,
	history: [],
};

const folderSlice = createSlice({
	name: "folder",
	initialState,
	reducers: {
		setOpenedFolder: (state, action: PayloadAction<Folder | null>) => {
			if (action.payload) {
				if (state.openedFolder) {
					state.history.push(state.openedFolder);
				}
				state.openedFolder = action.payload;
			} else {
				state.openedFolder = null;
				state.history = [];
			}
		},
		goBack: (state) => {
			if (state.history.length > 0) {
				state.openedFolder = state.history.pop() || null;
			} else {
				state.openedFolder = null;
			}
		},
	},
});

export const { setOpenedFolder, goBack } = folderSlice.actions;
export const openedFolder = (state: { folder: FolderState }) =>
	state.folder.openedFolder;
export default folderSlice.reducer;
