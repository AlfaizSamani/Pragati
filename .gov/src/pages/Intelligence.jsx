import React, { useEffect, useState } from "react";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import "../styles/analytics.css";
import { HeroBanner } from "../components/intelligence/HeroBanner";
import { TryTheseQuestions } from "../components/intelligence/TryTheseQuestions";
import { ConversationSection } from "../components/intelligence/ConversationSection";
import { RiskAnalyticsSection } from "../components/intelligence/RiskAnalyticsSection";
import { api } from "../services/apiClient";

export default function Intelligence() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
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

  async function submitQuestion(nextQuestion) {
    const normalizedQuestion = nextQuestion.trim();
    if (!normalizedQuestion || isThinking) return;
    setError("");
    setIsThinking(true);

    const requestId = `query-${Date.now()}`;
    const assistantMessageId = `assistant-${requestId}`;
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: `user-${requestId}`, role: "user", content: normalizedQuestion },
      { id: assistantMessageId, role: "assistant", content: "", pending: true },
    ]);

    try {
      const result = await api.intelligence({ id: `query-${Date.now()}`, question: normalizedQuestion, category: "general" }, import.meta.env.VITE_REPORTING_MONTH || "2026-06");
      const evidence = (result.sections || [])
        .filter((section) => section.type === "evidence")
        .flatMap((section) => section.data || []);
      setMessages((currentMessages) => currentMessages.map((message) => (
        message.id === assistantMessageId
          ? { ...message, content: result.summary || "No grounded response was returned.", evidence, pending: false }
          : message
      )));
    } catch (requestError) {
      setError(requestError.message);
      setMessages((currentMessages) => currentMessages.map((message) => (
        message.id === assistantMessageId
          ? { ...message, content: "I couldn't complete that request. Please try again.", pending: false, failed: true }
          : message
      )));
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
              <ConversationSection projectRecords={projects} messages={messages} isThinking={isThinking} onSubmit={submitQuestion} />
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