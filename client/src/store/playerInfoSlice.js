import { createSlice } from '@reduxjs/toolkit'
export const playerInfoSlice = createSlice({
  name: 'playerInfo',
  initialState: { 
    socketId : "",
    peerId : "",
    nickname : "",
    roomId : "",
},
  reducers: {
    setting_RoomId : (state,action) => {
      state.roomId  = action.payload
  },
    setting_socketId : (state,action) => {
        state.socketId  = action.payload
    },
    setting_peerId : (state,action) => {
        state.peerId  = action.payload
    },
    setting_Nickname : (state,action) => {
        state.nickname  = action.payload
    }
  },
})

export const {setting_socketId, setting_peerId, setting_Nickname, setting_RoomId } = playerInfoSlice.actions; 
export default playerInfoSlice;