import { createSlice } from '@reduxjs/toolkit'
export const roomStateSlice = createSlice({
  name: 'roomState',
  initialState: { 
    joinGame : false,
    roomList : false,
    createRoom : false
},
  reducers: {
    SET_JOINGAME : (state, action) => {
        state.joinGame = action.payload
    },
    SET_ROOMLIST : (state, action) => {
        state.roomList = action.payload
    },
    SET_CREATEROOM : (state, action) => {
        state.createRoom = action.payload
    }
  },
})

export const { SET_CREATEROOM, SET_JOINGAME, SET_ROOMLIST } = roomStateSlice.actions; 
export default roomStateSlice;