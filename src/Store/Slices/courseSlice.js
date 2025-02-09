import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
    selectedCourse: null, 
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
        },
        selectCourse: (state, action) => {
            state.selectedCourse = state.courses.find(course => course._id === action.payload) || null;
        },
        clearSelectedCourse: (state) => {
            state.selectedCourse = null;
        },
        updateCourse: (state, action) => {
            const index = state.courses.findIndex(course => course._id === action.payload._id);
            if (index !== -1) {
                state.courses[index] = action.payload; // Update the course in the array
            }
        },
        removeCourse: (state, action) => {
            state.courses = state.courses.filter(course => course._id !== action.payload);
            if (state.selectedCourse && state.selectedCourse._id === action.payload) {
                state.selectedCourse = null;
            }
        }
    },
});

export const { setCourses, selectCourse, clearSelectedCourse, updateCourse ,removeCourse } = courseSlice.actions;
export default courseSlice.reducer;
