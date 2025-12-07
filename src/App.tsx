import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Vocabulary } from "./pages/Vocabulary";
import { Grammar } from "./pages/Grammar";
import { Review } from "./pages/Review";
import { StudyPlan } from "./pages/StudyPlan";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/review" element={<Review />} />
          <Route path="/plan" element={<StudyPlan />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
