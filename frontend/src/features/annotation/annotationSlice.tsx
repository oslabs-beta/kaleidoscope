import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Annotation } from '../../types';

export const fetchAnnotations = createAsyncThunk('annotations/fetch', async () => {
    const response = await fetch('/api/annotations');
    return // response.data;
});

// Initial state
const initialState = {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const annotationSlice = createSlice({
    name: 'annotations',
    initialState,
    reducers: {
        addAnnotation: (state, action: PayloadAction<Annotation>) => {
            state.list.push(action.payload);
        },
        removeAnnotation: (state, action: PayloadAction<number>) => {
            state.list.splice(action.payload, 1);
        }
    },
    extraReducers: (builder) => {

    }
})

export const { addAnnotation, removeAnnotation } = annotationSlice.actions;
export default annotationSlice.reducer;