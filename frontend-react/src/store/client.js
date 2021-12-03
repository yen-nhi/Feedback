import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    token: null,
    isAuthenticated: false
};


const clientSlice = createSlice({
    name : 'auth',
    initialState: initialAuthState,
    reducers:{
        login(state, action) {
            localStorage.setItem('token', action.payload.token);
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
   
        logout(state) {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
        },
    }
});

export const clientActions = clientSlice.actions;
export default clientSlice.reducer;