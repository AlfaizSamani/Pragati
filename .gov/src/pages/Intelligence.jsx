import React, { useEffect, useState } from "react";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import "../styles/analytics.css";
import { HeroBanner } from "../components/intelligence/HeroBanner";
import { TryTheseQuestions } from "../components/intelligence/TryTheseQuestions";
import { ConversationSection } from "../components/intelligence/ConversationSection";
import { RiskAnalyticsSection } from "../components/intelligence/RiskAnalyticsSection";
import { Footer } from "../components/intelligence/Footer";
import { api } from "../services/apiClient";
import indiaGateUrl from "../assets/india-gate.jpg";

export default function Intelligence() {
  const [projects, setProjects] = useState([]);
  const [question, setQuestion] = useState("Which projects need immediate attention?");
  const [answer, setAnswer] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.priorityQueue(import.meta.env.VITE_REPORTING_MONTH || "2026-06", 5)
      .then((records) => setProjects(records.map((record) => ({
        id: record.canonical_id,
        name: record.project_name,
        type: record.sector || "Not reported",
        score: `${Number(record.risk_score || 0).toFixed(1)}%`,
        level: record.risk_tier || "Unknown",
        reasons: "See verified risk evidence for this project.",
      }))))
      .catch((requestError) => setError(requestError.message));
  }, []);

  async function submitQuestion(nextQuestion = question) {
    const normalizedQuestion = nextQuestion.trim();
    if (!normalizedQuestion || isThinking) return;
    setQuestion(nextQuestion);
    setError("");
    setIsThinking(true);
    try {
      const result = await api.intelligence({ id: `query-${Date.now()}`, question: normalizedQuestion, category: "general" }, import.meta.env.VITE_REPORTING_MONTH || "2026-06");
      setAnswer(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="intelligence-page bg-surface font-body-md text-body-md text-on-surface h-screen max-h-screen flex flex-col overflow-hidden">
<GlobalHeader activeId="intelligence" />
      <main className="w-full flex-1 min-h-0 bg-surface-container-low overflow-hidden">
        <div className="flex flex-col w-full h-full min-h-0">
          <div className="w-full h-full px-margin-lg py-2 flex flex-col gap-2 max-w-[1720px] mx-auto min-h-0">
            <HeroBanner />
            <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_295px] xl:grid-cols-[250px_minmax(0,1fr)_315px] gap-gutter-lg items-stretch flex-1 min-h-0">
              <div className="h-full min-h-0 overflow-hidden pr-1">
                <TryTheseQuestions onSelect={submitQuestion} />
              </div>
              <ConversationSection projectRecords={projects} question={question} answer={answer} isThinking={isThinking} onSubmit={submitQuestion} />
              <div className="h-full min-h-0 overflow-hidden pr-1">
                <RiskAnalyticsSection />
              </div>
            </div>
          </div>
        </div>
      </main>
      {error && <div className="error-banner" role="alert">Live intelligence data could not be loaded: {error}</div>}
      <GlobalFooter />
    </div>
  );
}