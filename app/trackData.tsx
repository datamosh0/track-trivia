import { createSlice } from "@reduxjs/toolkit";

export const trackDataSlice = createSlice({
  name: "trackData",
  initialState: {
    trackData: undefined,
    trackImport: undefined,
  },
  reducers: {
    setTrackData: (state: any, action: { payload: any }) => {
      state.trackData = action.payload;
    },
    setTracksImport: (state: any, action: { payload: any }) => {
      state.tracksImport = action.payload;
    },
  },
});

export const { setTrackData, setTracksImport } = trackDataSlice.actions;

export const selectTrackData = (state: any) => state.trackData.trackData;
export const selectTracksImport = (state: any) => state.trackData.tracksImport;

export default trackDataSlice.reducer;
