import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: "Message",
  initialState: {
    chatInfo: [],
  },
  reducers: {
    updateMessages(state, action) {
      state.chatInfo = [...action.payload]
    },
  },
})

export const { updateMessages } = messageSlice.actions
export default messageSlice.reducer
