import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    id: null,
    token: null,
    isAuthenticated: false
};


const clientSlice = createSlice({
    name : 'auth',
    initialState: initialAuthState,
    reducers:{
        login(state, action) {
            state.id = action.payload.id;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
   
        logout(state) {
            state.id = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    }
});

export const clientActions = clientSlice.actions;
export default clientSlice.reducer;