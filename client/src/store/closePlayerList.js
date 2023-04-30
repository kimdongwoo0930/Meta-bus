import { createSlice } from '@reduxjs/toolkit'
export const closePlayerListSlice = createSlice({
  name: 'closePlayerList',
  initialState: { value: [] },
  reducers: {
    refresh : ( state, action ) => {
        state.value = action.payload
    }
  },
})

export const { refresh } = closePlayerListSlice.actions; 
export default closePlayerListSlice;