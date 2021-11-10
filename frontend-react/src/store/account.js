import { createSlice } from "@reduxjs/toolkit";

const initialAccountState = {
    profile: false,
    surveys: false,
    reports: false
};


const accountSlice = createSlice({
    name : 'account',
    initialState: initialAccountState,
    reducers:{
        surveysToggle(state) {
            state.surveys = !state.surveys;
        },
   
        profileToggle(state) {
            state.profile = !state.profile;
        },

        reportsToggle(state) {
            state.reports = !state.reports;
        }
    }
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;