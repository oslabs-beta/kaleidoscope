// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import nodeMapReducer from '../features/nodeMap/nodeMapSlice';
import annotationsReducer from '../features/annotations/annotationsSlice';

export const store = configureStore({
  reducer: {
    nodeMap: nodeMapReducer,
    annotations: annotationsReducer,
  },
});
