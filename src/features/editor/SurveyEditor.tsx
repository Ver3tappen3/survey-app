import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import type {
  Question,
  QuestionType,
  Survey,
} from "../../types/survey";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import {
  setTitle,
  setDescription,
  setQuestions,
  resetEditor,
} from "./editorSlice";

import {
  addSurvey,
  updateSurvey,
} from "../surveys/surveysSlice";

import "./SurveyEditor.css";

const createId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

interface SurveyEditorProps {
  onBack: () => void;
}

interface SortableQuestionProps {
  question: Question;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (question: Question) => void;
}

function SortableQuestion({
  question,
  index,
  onDelete,
  onUpdate,
}: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform,
    ),
    transition,
  };

  const updateQuestion = (
    changes: Partial<Question>,
  ) => {
    onUpdate({
      ...question,
      ...changes,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="question-card"
    >
      <div className="question-header">
        <button
          type="button"
          className="drag-handle"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>

        <span className="question-number">
          Вопрос {index + 1}
        </span>

        <button
          type="button"
          className="delete-button"
          onClick={() =>
            onDelete(question.id)
          }
        >
          Удалить
        </button>
      </div>

      <div className="question-content">
        <label>
          Вопрос

          <input
            value={question.title}
            onChange={(event) =>
              updateQuestion({
                title: event.target.value,
              })
            }
            placeholder="Введите вопрос..."
          />
        </label>

        <label>
          Тип вопроса

          <select
            value={question.type}
            onChange={(event) =>
              updateQuestion({
                type: event.target
                  .value as QuestionType,
              })
            }
          >
            <option value="text">
              Текст
            </option>

            <option value="single">
              Один вариант
            </option>

            <option value="multiple">
              Несколько вариантов
            </option>

            <option value="rating">
              Оценка
            </option>

            <option value="yesno">
              Да / Нет
            </option>
          </select>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(event) =>
              updateQuestion({
                required:
                  event.target.checked,
              })
            }
          />

          Обязательный вопрос
        </label>

        {(question.type === "single" ||
          question.type === "multiple") && (
          <div className="options-block">
            <div className="options-title">
              Варианты ответа
            </div>

            {question.options?.map(
              (option) => (
                <div
                  key={option.id}
                  className="option-row"
                >
                  <input
                    value={option.text}
                    onChange={(event) => {
                      const options =
                        question.options?.map(
                          (item) =>
                            item.id ===
                            option.id
                              ? {
                                  ...item,
                                  text: event
                                    .target
                                    .value,
                                }
                              : item,
                        );

                      updateQuestion({
                        options,
                      });
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const options =
                        question.options?.filter(
                          (item) =>
                            item.id !==
                            option.id,
                        );

                      updateQuestion({
                        options,
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              ),
            )}

            <button
              type="button"
              className="add-option-button"
              onClick={() => {
                const options = [
                  ...(question.options ?? []),
                  {
                    id: createId(),
                    text: `Вариант ${
                      (question.options
                        ?.length ?? 0) + 1
                    }`,
                  },
                ];

                updateQuestion({
                  options,
                });
              }}
            >
              + Добавить вариант
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SurveyEditor({
  onBack,
}: SurveyEditorProps) {
  const dispatch = useAppDispatch();

  const title = useAppSelector(
    (state) => state.editor.title,
  );

  const description = useAppSelector(
    (state) => state.editor.description,
  );

  const questions = useAppSelector(
    (state) => state.editor.questions,
  );

  const activeSurveyId =
    useAppSelector(
      (state) =>
        state.surveys.activeSurveyId,
    );

  const surveys = useAppSelector(
    (state) => state.surveys.surveys,
  );

  const addQuestion = (
    type: QuestionType = "text",
  ) => {
    const question: Question = {
      id: createId(),
      type,
      title: "Новый вопрос",
      required: false,

      options:
        type === "single" ||
        type === "multiple"
          ? [
              {
                id: createId(),
                text: "Вариант 1",
              },
              {
                id: createId(),
                text: "Вариант 2",
              },
            ]
          : undefined,
    };

    dispatch(
      setQuestions([
        ...questions,
        question,
      ]),
    );
  };

  const deleteQuestion = (
    id: string,
  ) => {
    dispatch(
      setQuestions(
        questions.filter(
          (question) =>
            question.id !== id,
        ),
      ),
    );
  };

  const updateQuestion = (
    updatedQuestion: Question,
  ) => {
    dispatch(
      setQuestions(
        questions.map((question) =>
          question.id ===
          updatedQuestion.id
            ? updatedQuestion
            : question,
        ),
      ),
    );
  };

  const handleDragEnd = (
    event: DragEndEvent,
  ) => {
    const {
      active,
      over,
    } = event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex =
      questions.findIndex(
        (question) =>
          question.id === active.id,
      );

    const newIndex =
      questions.findIndex(
        (question) =>
          question.id === over.id,
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    dispatch(
      setQuestions(
        arrayMove(
          questions,
          oldIndex,
          newIndex,
        ),
      ),
    );
  };

  const saveSurvey = () => {
    const now = new Date().toISOString();

    if (activeSurveyId) {
      const existingSurvey =
        surveys.find(
          (survey) =>
            survey.id ===
            activeSurveyId,
        );

      if (existingSurvey) {
        const updatedSurvey: Survey = {
          ...existingSurvey,
          title,
          description,
          questions,
          updatedAt: now,
        };

        dispatch(
          updateSurvey(updatedSurvey),
        );
      }
    } else {
      const newSurvey: Survey = {
        id: createId(),
        title,
        description,
        questions,
        createdAt: now,
        updatedAt: now,
        status: "draft",
      };

      dispatch(
        addSurvey(newSurvey),
      );
    }

    alert("Опрос сохранён!");

    onBack();
  };

  const handleBack = () => {
    dispatch(resetEditor());
    onBack();
  };

  return (
    <main className="editor-page">
      <div className="editor-container">
        <header className="editor-top">
          <div>
            <button
              type="button"
              onClick={handleBack}
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                padding: 0,
                marginBottom: 12,
                color: "#6b7280",
              }}
            >
              ← Назад к опросам
            </button>

            <h1>
              Конструктор опроса
            </h1>

            <p>
              Создайте вопросы и
              настройте порядок
            </p>
          </div>

          <button
            type="button"
            className="save-button"
            onClick={saveSurvey}
          >
            Сохранить
          </button>
        </header>

        <section className="survey-info">
          <input
            className="survey-title"
            value={title}
            onChange={(event) =>
              dispatch(
                setTitle(
                  event.target.value,
                ),
              )
            }
            placeholder="Название опроса"
          />

          <textarea
            className="survey-description"
            value={description}
            onChange={(event) =>
              dispatch(
                setDescription(
                  event.target.value,
                ),
              )
            }
            placeholder="Описание опроса"
          />
        </section>

        <section className="questions-section">
          <div className="section-title">
            <h2>Вопросы</h2>

            <span>
              {questions.length}{" "}
              {questions.length === 1
                ? "вопрос"
                : "вопросов"}
            </span>
          </div>

          <DndContext
            collisionDetection={
              closestCenter
            }
            onDragEnd={
              handleDragEnd
            }
          >
            <SortableContext
              items={questions.map(
                (question) =>
                  question.id,
              )}
              strategy={
                verticalListSortingStrategy
              }
            >
              <div className="questions-list">
                {questions.map(
                  (
                    question,
                    index,
                  ) => (
                    <SortableQuestion
                      key={
                        question.id
                      }
                      question={
                        question
                      }
                      index={index}
                      onDelete={
                        deleteQuestion
                      }
                      onUpdate={
                        updateQuestion
                      }
                    />
                  ),
                )}
              </div>
            </SortableContext>
          </DndContext>

          {questions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                📝
              </div>

              <h3>
                Пока нет вопросов
              </h3>

              <p>
                Добавьте первый
                вопрос, чтобы
                начать
              </p>
            </div>
          )}

          <div className="add-question-panel">
            <button
              type="button"
              onClick={() =>
                addQuestion("text")
              }
            >
              + Текст
            </button>

            <button
              type="button"
              onClick={() =>
                addQuestion("single")
              }
            >
              + Один вариант
            </button>

            <button
              type="button"
              onClick={() =>
                addQuestion(
                  "multiple",
                )
              }
            >
              + Несколько
              вариантов
            </button>

            <button
              type="button"
              onClick={() =>
                addQuestion("rating")
              }
            >
              + Оценка
            </button>

            <button
              type="button"
              onClick={() =>
                addQuestion("yesno")
              }
            >
              + Да / Нет
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}