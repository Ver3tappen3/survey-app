
import { useAppSelector } from "../app/hooks";
import type { Question, SurveyResponse } from "../types/survey";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./SimplePages.css";
import "./ResultsPage.css";

interface ResultsPageProps {
  surveyId: string;
  onBack: () => void;
}

function ResultsPage({ surveyId, onBack }: ResultsPageProps) {
  const survey = useAppSelector((state) =>
    state.surveys.surveys.find((item) => item.id === surveyId),
  );

  const responses = useAppSelector((state) =>
    state.responses.responses.filter(
      (response) => response.surveyId === surveyId,
    ),
  );

  if (!survey) {
    return (
      <main className="simple-page">
        <h1>Опрос не найден</h1>
        <button onClick={onBack}>Назад</button>
      </main>
    );
  }

  const getStats = (question: Question) => {
    const answers = responses
      .map((response: SurveyResponse) => response.answers[question.id])
      .filter((answer) => answer !== undefined && answer !== "");

    if (question.type === "text") {
      return [];
    }

    let labels: { id: string; text: string }[] = [];

    if (question.type === "single" || question.type === "multiple") {
      labels = (question.options ?? []).map((option) => ({
        id: option.id,
        text: option.text,
      }));
    } else if (question.type === "yesno") {
      labels = [
        { id: "Да", text: "Да" },
        { id: "Нет", text: "Нет" },
      ];
    } else if (question.type === "rating") {
      labels = [1, 2, 3, 4, 5].map((value) => ({
        id: String(value),
        text: String(value),
      }));
    }

    
 return labels.map((option) => {
  const count = answers.reduce<number>((total, answer) => {
    if (Array.isArray(answer)) {
      return total + (answer.map(String).includes(option.id) ? 1 : 0);
    }

    return total + (String(answer) === option.id ? 1 : 0);
  }, 0);

  return {
    name: option.text,
    Количество: count,
    Процент:
      answers.length > 0
        ? Math.round((count / answers.length) * 100)
        : 0,
  };
});


  return (
    <main className="simple-page results-page">
      <button onClick={onBack}>← Назад к опросам</button>

      <h1>Результаты опроса</h1>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>

      <section className="results-summary">
        <div className="results-summary-card">
          <span>Всего ответов</span>
          <strong>{responses.length}</strong>
        </div>

        <div className="results-summary-card">
          <span>Всего вопросов</span>
          <strong>{survey.questions.length}</strong>
        </div>
      </section>

      {responses.length === 0 && (
        <p>Пока никто не прошёл этот опрос.</p>
      )}

      {survey.questions.map((question, index) => {
        const stats = getStats(question);

        const textAnswers = responses
          .map((response) => response.answers[question.id])
          .filter(
            (answer): answer is string =>
              typeof answer === "string" && answer.trim() !== "",
          );

        return (
          <section className="results-question" key={question.id}>
            <h3>
              {index + 1}. {question.title}
            </h3>

            <p className="results-answer-count">
              Ответов:{" "}
              {responses.filter(
                (response) =>
                  response.answers[question.id] !== undefined &&
                  response.answers[question.id] !== "" &&
                  !(
                    Array.isArray(response.answers[question.id]) &&
                    (response.answers[question.id] as string[]).length === 0
                  ),
              ).length}
            </p>

            {question.type === "text" ? (
              textAnswers.length > 0 ? (
                <ul className="text-answers">
                  {textAnswers.map((answer, answerIndex) => (
                    <li key={`${question.id}-${answerIndex}`}>
                      {answer}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Текстовых ответов пока нет.</p>
              )
            ) : (
              <>
                <div className="results-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="Количество" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="results-stats-list">
                  {stats.map((item) => (
                    <div className="results-stats-row" key={item.name}>
                      <span>{item.name}</span>
                      <strong>
                        {item.Количество} ({item.Процент}%)
                      </strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}
    </main>
  );
}

export default ResultsPage;
