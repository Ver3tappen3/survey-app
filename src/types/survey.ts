export type QuestionType =
  | "text"
  | "single"
  | "multiple"
  | "rating"
  | "yesno";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string | string[] | number>;
  createdAt: string;
}