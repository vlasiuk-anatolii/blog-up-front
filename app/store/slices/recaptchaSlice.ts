import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecaptchaState {
	isReady: boolean;
}

const initialState: RecaptchaState = {
	isReady: false,
};

const recaptchaSlice = createSlice({
	name: "recaptcha",
	initialState,
	reducers: {
		setIsRecaptchaReady(state, action: PayloadAction<boolean>) {
			state.isReady = action.payload;
		},
	},
});

export const { setIsRecaptchaReady } = recaptchaSlice.actions;

export const recaptchaReducer = recaptchaSlice.reducer;