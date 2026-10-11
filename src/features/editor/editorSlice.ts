import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Question } from "../../types/survey";

interface EditorState {
  title: string;
  description: string;
  questions: Question[];
}

const initialState: EditorState = {
  title: "Новый опрос",
  description: "Описание вашего опроса",
  questions: [],
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    setDescription: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.description = action.payload;
    },

    setQuestions: (
      state,
      action: PayloadAction<Question[]>,
    ) => {
      state.questions = action.payload;
    },

    resetEditor: () => initialState,
  },
});

export const {
  setTitle,
  setDescription,
  setQuestions,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;