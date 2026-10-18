
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addResponse } from "../features/responses/responsesSlice";
import type { Survey, SurveyResponse } from "../types/survey";
import "./SimplePages.css";

interface TakeSurveyPageProps {
  surveyId: string;
  onBack: () => void;
  onResults: () => void;
}

function TakeSurveyPage({
  surveyId,
  onBack,
  onResults,
}: TakeSurveyPageProps) {
  const dispatch = useAppDispatch();

  const survey = useAppSelector((state) =>
    state.surveys.surveys.find(
      (item: Survey) => item.id === surveyId,
    ),
  );

  const [answers, setAnswers] = useState<
    Record<string, string | string[] | number>
  >({});

  if (!survey || survey.status !== "published") {
    return (
      <main className="simple-page">
        <h1>Опрос недоступен</h1>
        <button onClick={onBack}>Назад</button>
      </main>
    );
  }

  const changeAnswer = (
    questionId: string,
    value: string | string[] | number,
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const unanswered = survey.questions.find((question) => {
      if (!question.required) return false;

      const answer = answers[question.id];

      return (
        answer === undefined ||
        answer === "" ||
        (Array.isArray(answer) && answer.length === 0)
      );
    });

    if (unanswered) {
      alert(`Ответьте на обязательный вопрос: ${unanswered.title}`);
      return;
    }

    const response: SurveyResponse = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      surveyId: survey.id,
      answers,
      createdAt: new Date().toISOString(),
    };

    dispatch(addResponse(response));
    alert("Ответы сохранены!");
    onResults();
  };

  return (
    <main className="simple-page">
      <button onClick={onBack}>← Назад к опросам</button>

      <h1>{survey.title}</h1>
      <p>{survey.description}</p>

      {survey.questions.length === 0 ? (
        <p>В этом опросе пока нет вопросов.</p>
      ) : (
        survey.questions.map((question, index) => (
          <section className="simple-question" key={question.id}>
            <h3>
              {index + 1}. {question.title}
              {question.required && " *"}
            </h3>

            {question.description && <p>{question.description}</p>}

            {question.type === "text" && (
              <textarea
                value={String(answers[question.id] ?? "")}
                onChange={(event) =>
                  changeAnswer(question.id, event.target.value)
                }
                placeholder="Введите ответ"
              />
            )}

            {question.type === "single" &&
              (question.options ?? []).map((option) => (
                <label className="simple-option" key={option.id}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => changeAnswer(question.id, option.id)}
                  />
                  {option.text}
                </label>
              ))}

            {question.type === "multiple" &&
              (question.options ?? []).map((option) => {
                const selected = Array.isArray(answers[question.id])
                  ? (answers[question.id] as string[])
                  : [];

                return (
                  <label className="simple-option" key={option.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(option.id)}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...selected, option.id]
                          : selected.filter((id) => id !== option.id);

                        changeAnswer(question.id, next);
                      }}
                    />
                    {option.text}
                  </label>
                );
              })}

            {question.type === "rating" && (
              <div className="simple-rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating}>
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === rating}
                      onChange={() => changeAnswer(question.id, rating)}
                    />
                    {rating}
                  </label>
                ))}
              </div>
            )}

            {question.type === "yesno" &&
              ["Да", "Нет"].map((answer) => (
                <label className="simple-option" key={answer}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === answer}
                    onChange={() => changeAnswer(question.id, answer)}
                  />
                  {answer}
                </label>
              ))}
          </section>
        ))
      )}

      {survey.questions.length > 0 && (
        <button onClick={handleSubmit}>Отправить ответы</button>
      )}
    </main>
  );
}

export default TakeSurveyPage;