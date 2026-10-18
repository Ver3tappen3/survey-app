
import { useState } from "react";
import SurveysPage from "./pages/SurveysPage";
import SurveyEditor from "./features/editor/SurveyEditor";
import TakeSurveyPage from "./pages/TakeSurveyPage";
import ResultsPage from "./pages/ResultsPage";

type Page = "surveys" | "editor" | "take" | "results";

function App() {
  const [page, setPage] = useState<Page>("surveys");
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(
    null,
  );

  if (page === "editor") {
    return <SurveyEditor onBack={() => setPage("surveys")} />;
  }

  if (page === "take" && selectedSurveyId) {
    return (
      <TakeSurveyPage
        surveyId={selectedSurveyId}
        onBack={() => setPage("surveys")}
        onResults={() => setPage("results")}
      />
    );
  }

  if (page === "results" && selectedSurveyId) {
    return (
      <ResultsPage
        surveyId={selectedSurveyId}
        onBack={() => setPage("surveys")}
      />
    );
  }

  return (
    <SurveysPage
      onCreate={() => setPage("editor")}
      onEdit={() => setPage("editor")}
      onTake={(id) => {
        setSelectedSurveyId(id);
        setPage("take");
      }}
      onResults={(id) => {
        setSelectedSurveyId(id);
        setPage("results");
      }}
    />
  );
}

export default App;