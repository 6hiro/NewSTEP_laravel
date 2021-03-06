import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/pages/Auth/authSlice";
import postReducer from "../features/pages/Post/postSlice";
import roadmapSlice from '../features/pages/Roadmap/roadmapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    roadmap: roadmapSlice,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
// dispatchに対して型を定義し、コンポーネントで利用できるようにexportする
export type AppDispatch = typeof store.dispatch;