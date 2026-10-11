import { useState } from "react";
import SurveysPage from "./pages/SurveysPage";
import SurveyEditor from "./features/editor/SurveyEditor";

function App() {
  const [page, setPage] = useState<"surveys" | "editor">(
    "surveys",
  );

  if (page === "editor") {
    return (
      <SurveyEditor
        onBack={() => setPage("surveys")}
      />
    );
  }

  return (
    <SurveysPage
      onCreate={() => setPage("editor")}
      onEdit={() => setPage("editor")}
    />
  );
}

export default App;