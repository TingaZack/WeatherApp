import {configureStore} from '@reduxjs/toolkit';
import weatherSlice from '../features/weather/weatherSlice';

const store = configureStore({
  reducer: {
    weather: weatherSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

