import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Annotation } from '../../types';

type AnnotationState = {
    list: Annotation[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
}

// grab annotations from the backend
export const fetchAnnotations = createAsyncThunk('annotations/fetch', async () => {
    try {    
        const response = await fetch('http://localhost:3001/annotations');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        console.log('response', response);
        const data = await response.json();
        console.log('data', data);
        return data;
    } catch (error) {
        console.error("Error fetching annotations:", error);
    }
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
        builder.addCase(fetchAnnotations.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchAnnotations.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.list = state.list.concat(action.payload);
        });
        builder.addCase(fetchAnnotations.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ? action.error.message : null;
        });
    }
})

export const { addAnnotation, removeAnnotation } = annotationSlice.actions;
export default annotationSlice.reducer;