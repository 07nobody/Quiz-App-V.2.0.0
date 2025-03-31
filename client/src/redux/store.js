import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import loaderReducer from "./loaderSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
    reducer: {
        users: usersReducer,
        loader: loaderReducer,
        theme: themeReducer,
    },
});

export default store;
