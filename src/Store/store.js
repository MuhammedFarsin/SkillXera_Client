import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./Slices/authSlice";
import userReducer from "./Slices/userSlice";
import courseReducer from "./Slices/courseSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "user"], // Only persist necessary reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  course: courseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store, {}, () => {
  store.dispatch({ type: "persist/rehydrate" }); // Ensure persistence state is updated
});

export default store;
