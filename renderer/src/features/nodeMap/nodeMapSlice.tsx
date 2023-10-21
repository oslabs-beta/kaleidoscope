import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit' // this is needed for the type of the payload in the reducer

export interface NodeMapState {
    // define the state of the nodeMap here
}

const initialState: NodeMapState = {
    // define the initial state of the nodeMap here
}

export const nodeMapSlice = createSlice({
    name: 'nodeMap',
    initialState,
    reducers: {
        // these reducers will define how the nodeMap's state can be updated

    }
})

// export the actions defined in the slice
export const { } = nodeMapSlice.actions;

export default nodeMapSlice.reducer;