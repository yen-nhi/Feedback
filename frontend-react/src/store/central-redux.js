import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './client';
import accountReducer from './account';
import apiEndpointReducer from './api-endpoint';

const store = configureStore({
    reducer: { 
        auth: clientReducer,
        account: accountReducer,
    }
});

export default store;