import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Annotation } from '../../types';

type AnnotationState = {
    list: Annotation[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
}

export const fetchAnnotations = createAsyncThunk('annotations/fetch', async () => {
    const response = await fetch('/api/annotations');
    return // response.data;
});

// Initial state
const initialState: AnnotationState = {
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