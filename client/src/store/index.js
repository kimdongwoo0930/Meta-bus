import { configureStore } from '@reduxjs/toolkit';
import closePlayerListSlice from './closePlayerList';
import playerInfoSlice from './playerInfoSlice';
import roomStateSlice from './roomStateSlice';

const store = configureStore({
	reducer: {
       closePlayerList : closePlayerListSlice.reducer,
       playerInfo : playerInfoSlice.reducer,
       roomState : roomStateSlice.reducer,
    },
})

export default store;
