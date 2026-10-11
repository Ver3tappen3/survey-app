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
}

function SurveysPage({
  onCreate,
  onEdit,
}: SurveysPageProps) {
  const dispatch = useAppDispatch();

  const surveys = useAppSelector(
    (state) => state.surveys.surveys,
  );

  const handleCreate = () => {
    dispatch(resetEditor());
    dispatch(setActiveSurvey(null));
    onCreate();
  };

  const handleEdit = (surveyId: string) => {
    const survey = surveys.find(
      (item) => item.id === surveyId,
    );

    if (!survey) {
      return;
    }

    dispatch(setActiveSurvey(survey.id));
    dispatch(setTitle(survey.title));
    dispatch(setDescription(survey.description));
    dispatch(setQuestions(survey.questions));

    onEdit();
  };

  const handleDelete = (surveyId: string) => {
    const confirmed = window.confirm(
      "Удалить этот опрос?",
    );

    if (confirmed) {
      dispatch(deleteSurvey(surveyId));
    }
  };

  const handlePublish = (surveyId: string) => {
    const confirmed = window.confirm(
      "Опубликовать этот опрос?",
    );

    if (confirmed) {
      dispatch(publishSurvey(surveyId));
    }
  };

  return (
    <main className="surveys-page">
      <div className="surveys-container">
        <header className="surveys-header">
          <div>
            <h1>Мои опросы</h1>

            <p>
              Создавайте и управляйте своими опросами
            </p>
          </div>

          <button
            className="create-survey-button"
            onClick={handleCreate}
          >
            + Создать опрос
          </button>
        </header>

        {surveys.length === 0 ? (
          <section className="empty-surveys">
            <div className="empty-surveys-icon">
              📝
            </div>

            <h2>Пока нет опросов</h2>

            <p>
              Создайте свой первый опрос, чтобы
              начать собирать ответы.
            </p>

            <button
              className="create-empty-button"
              onClick={handleCreate}
            >
              Создать первый опрос
            </button>
          </section>
        ) : (
          <section className="surveys-grid">
            {surveys.map((survey) => (
              <article
                className="survey-card"
                key={survey.id}
              >
                <div className="survey-card-top">
                  <span
                    className={`survey-status ${survey.status}`}
                  >
                    {survey.status === "published"
                      ? "Опубликован"
                      : "Черновик"}
                  </span>

                  <button
                    className="delete-survey-button"
                    onClick={() =>
                      handleDelete(survey.id)
                    }
                  >
                    Удалить
                  </button>
                </div>

                <h2>{survey.title}</h2>

                <p>{survey.description}</p>

                <div className="survey-card-info">
                  <span>
                    Вопросов:{" "}
                    {survey.questions.length}
                  </span>

                  <span>
                    {new Date(
                      survey.updatedAt,
                    ).toLocaleDateString("ru-RU")}
                  </span>
                </div>

                <div className="survey-card-actions">
                  <button
                    className="edit-survey-button"
                    onClick={() =>
                      handleEdit(survey.id)
                    }
                  >
                    Редактировать
                  </button>

                  {survey.status === "draft" && (
                    <button
                      className="publish-survey-button"
                      onClick={() =>
                        handlePublish(survey.id)
                      }
                    >
                      Опубликовать
                    </button>
                  )}

                  {survey.status === "published" && (
                    <button
                      className="published-button"
                      disabled
                    >
                      ✓ Опубликован
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default SurveysPage;