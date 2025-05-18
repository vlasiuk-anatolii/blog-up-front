import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/postsSlice';
import { recaptchaReducer } from './slices/recaptchaSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      posts: postsReducer,
      recaptcha: recaptchaReducer,
    },
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
