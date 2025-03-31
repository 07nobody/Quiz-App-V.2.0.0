import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: "users",
    initialState: {
        user: null
    },
    reducers: {
        SetUser: (state, action) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        }
    }
});

export const { SetUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;
