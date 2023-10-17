import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/named
import uploadReducer from './slices/upload';

const store = configureStore({
    reducer: {
        upload: uploadReducer,
    },
});

export default store;
