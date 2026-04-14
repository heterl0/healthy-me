import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appName: "Healthy Me",
} as const;

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

export default appSlice.reducer;
