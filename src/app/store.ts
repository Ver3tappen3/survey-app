import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
} from "redux-persist";

import surveysReducer from "../features/surveys/surveysSlice";
import editorReducer from "../features/editor/editorSlice";

const storage = {
  getItem: (key: string) => {
    return Promise.resolve(
      localStorage.getItem(key),
    );
  },

  setItem: (
    key: string,
    value: string,
  ) => {
    localStorage.setItem(key, value);

    return Promise.resolve();
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);

    return Promise.resolve();
  },
};

const rootReducer = combineReducers({
  surveys: surveysReducer,
  editor: editorReducer,
});

const persistConfig = {
  key: "survey-app",
  storage,
  whitelist: [
    "surveys",
    "editor",
  ],
};

const persistedReducer =
  persistReducer(
    persistConfig,
    rootReducer,
  );

export const store =
  configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const persistor =
  persistStore(store);

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;