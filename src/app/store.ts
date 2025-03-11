import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
//   middleware,
//   devTools: process.env.NODE_ENV !== "production",
//   enhancers: [reduxBatch],
});

// Tạo type cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
