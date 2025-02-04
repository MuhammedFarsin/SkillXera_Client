import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   name : "",
   email : "",
   isAdmin : false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            Object.assign(state, action.payload);
        },
        removeUser: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
