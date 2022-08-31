import { createSlice } from "@reduxjs/toolkit";

export const trackDataSlice = createSlice({
  name: "trackData",
  initialState: {
    trackData: undefined,
    trackImport: undefined,
    volume: 0.75,
  },
  reducers: {
    setTrackData: (state: any, action: { payload: any }) => {
      state.trackData = action.payload;
    },
    setTracksImport: (state: any, action: { payload: any }) => {
      state.tracksImport = action.payload;
    },
    setVolume: (state: any, action: { payload: any }) => {
      state.volume = action.payload;
    },
  },
});

export const { setTrackData, setTracksImport, setVolume } =
  trackDataSlice.actions;

export const selectTrackData = (state: any) => state.trackData.trackData;
export const selectTracksImport = (state: any) => state.trackData.tracksImport;
export const selectVolume = (state: any) => state.trackData.volume;

export default trackDataSlice.reducer;
