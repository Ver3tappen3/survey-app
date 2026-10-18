
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SurveyResponse } from "../../types/survey";

interface ResponsesState {
  responses: SurveyResponse[];
}

const initialState: ResponsesState = {
  responses: [],
};

const responsesSlice = createSlice({
  name: "responses",
  initialState,
  reducers: {
    addResponse: (state, action: PayloadAction<SurveyResponse>) => {
      state.responses.push(action.payload);
    },
  },
});

export const { addResponse } = responsesSlice.actions;
export default responsesSlice.reducer;