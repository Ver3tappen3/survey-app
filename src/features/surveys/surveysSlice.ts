import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Survey } from "../../types/survey";

interface SurveysState {
  surveys: Survey[];
  activeSurveyId: string | null;
}

const initialState: SurveysState = {
  surveys: [],
  activeSurveyId: null,
};

const surveysSlice = createSlice({
  name: "surveys",
  initialState,
  reducers: {
    addSurvey: (state, action: PayloadAction<Survey>) => {
      state.surveys.push(action.payload);
    },

    updateSurvey: (state, action: PayloadAction<Survey>) => {
      const index = state.surveys.findIndex(
        (survey) => survey.id === action.payload.id,
      );

      if (index !== -1) {
        state.surveys[index] = action.payload;
      }
    },

    deleteSurvey: (state, action: PayloadAction<string>) => {
      state.surveys = state.surveys.filter(
        (survey) => survey.id !== action.payload,
      );

      if (state.activeSurveyId === action.payload) {
        state.activeSurveyId = null;
      }
    },

    publishSurvey: (state, action: PayloadAction<string>) => {
      const survey = state.surveys.find(
        (survey) => survey.id === action.payload,
      );

      if (survey) {
        survey.status = "published";
        survey.updatedAt = new Date().toISOString();
      }
    },

    setActiveSurvey: (state, action: PayloadAction<string | null>) => {
      state.activeSurveyId = action.payload;
    },
  },
});

export const {
  addSurvey,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  setActiveSurvey,
} = surveysSlice.actions;

export default surveysSlice.reducer;