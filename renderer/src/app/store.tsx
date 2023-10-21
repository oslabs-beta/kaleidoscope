// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import nodeMapReducer from '../features/nodeMap/nodeMapSlice';
// import annotationsReducer from '../features/annotations/annotationsSlice';

export const store = configureStore({
  reducer: {
    nodeMap: nodeMapReducer,
    // annotations: annotationsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {nodeMap: NodeMapState}
export type AppDispatch = typeof store.dispatch;