
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteSurvey,
  publishSurvey,
  setActiveSurvey,
} from "../features/surveys/surveysSlice";
import {
  resetEditor,
  setDescription,
  setQuestions,
  setTitle,
} from "../features/editor/editorSlice";
import "./SurveysPage.css";

interface SurveysPageProps {
  onCreate: () => void;
  onEdit: () => void;
  onTake: (id: string) => void;
  onResults: (id: string) => void;
}

function SurveysPage({
  onCreate,
  onEdit,
  onTake,
  onResults,
}: SurveysPageProps) {
  const dispatch = useAppDispatch();

  const surveys = useAppSelector((state) => state.surveys.surveys);
  const responses = useAppSelector((state) => state.responses.responses);

  const handleCreate = () => {
    dispatch(resetEditor());
    dispatch(setActiveSurvey(null));
    onCreate();
  };

  const handleEdit = (surveyId: string) => {
    const survey = surveys.find((item) => item.id === surveyId);
    if (!survey) return;

    dispatch(setActiveSurvey(survey.id));
    dispatch(setTitle(survey.title));
    dispatch(setDescription(survey.description));
    dispatch(setQuestions(survey.questions));
    onEdit();
  };

  const handleDelete = (surveyId: string) => {
    if (window.confirm("Удалить этот опрос?")) {
      dispatch(deleteSurvey(surveyId));
    }
  };

  const handlePublish = (surveyId: string) => {
    const survey = surveys.find((item) => item.id === surveyId);

    if (!survey) return;

    if (survey.questions.length === 0) {
      alert("Добавьте хотя бы один вопрос перед публикацией.");
      return;
    }

    if (window.confirm("Опубликовать этот опрос?")) {
      dispatch(publishSurvey(surveyId));
    }
  };

  return (
    <main className="surveys-page">
      <div className="surveys-container">
        <header className="surveys-header">
          <div>
            <h1>Мои опросы</h1>
            <p>Создавайте и управляйте своими опросами</p>
          </div>

          <button className="create-survey-button" onClick={handleCreate}>
            + Создать опрос
          </button>
        </header>

        {surveys.length === 0 ? (
          <section className="empty-surveys">
            <h2>Пока нет опросов</h2>
            <p>Создайте свой первый опрос.</p>
            <button className="create-empty-button" onClick={handleCreate}>
              Создать опрос
            </button>
          </section>
        ) : (
          <section className="surveys-grid">
            {surveys.map((survey) => {
              const responseCount = responses.filter(
                (response) => response.surveyId === survey.id,
              ).length;

              return (
                <article className="survey-card" key={survey.id}>
                  <div className="survey-card-top">
                    <span className={`survey-status ${survey.status}`}>
                      {survey.status === "published"
                        ? "Опубликован"
                        : "Черновик"}
                    </span>

                    <button
                      className="delete-survey-button"
                      onClick={() => handleDelete(survey.id)}
                    >
                      Удалить
                    </button>
                  </div>

                  <h2>{survey.title}</h2>
                  <p>{survey.description}</p>

                  <div className="survey-card-info">
                    <span>Вопросов: {survey.questions.length}</span>
                    <span>Ответов: {responseCount}</span>
                  </div>

                  <div className="survey-card-actions">
                    <button
                      className="edit-survey-button"
                      onClick={() => handleEdit(survey.id)}
                    >
                      Редактировать
                    </button>

                    {survey.status === "draft" ? (
                      <button
                        className="publish-survey-button"
                        onClick={() => handlePublish(survey.id)}
                      >
                        Опубликовать
                      </button>
                    ) : (
                      <button onClick={() => onTake(survey.id)}>
                        Пройти опрос
                      </button>
                    )}

                    <button onClick={() => onResults(survey.id)}>
                      Результаты
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default SurveysPage;