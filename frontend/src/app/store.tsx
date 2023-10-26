// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import nodeMapReducer from '../features/nodeMap/nodeMapSlice';
import annotationsReducer from '../features/annotation/annotationSlice';

const rootReducer = combineReducers({
  nodeMap: nodeMapReducer,
  annotations: annotationsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {nodeMap: NodeMapState}
export type AppDispatch = typeof store.dispatch;