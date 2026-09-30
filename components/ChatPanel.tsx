"use client";

import { useState } from "react";
import type { Lead, ChatMessage } from "@/types/lead";
import { updateLead } from "@/lib/storage";

type Props = {
  lead: Lead;
  onLeadUpdate: (lead: Lead) => void;
};

export default function ChatPanel({ lead, onLeadUpdate }: Props) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!lead.analysis) {
    return (
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        Chat is available after analysis is complete.
      </section>
    );
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError("");

    // A failed request leaves its question visible; reuse it on retry.
    const alreadyPending = lead.chat.at(-1)?.role === "user" && lead.chat.at(-1)?.text === q;
    const userMsg: ChatMessage = { role: "user", text: q, at: new Date().toISOString() };
    const updatedChat = alreadyPending ? lead.chat : [...lead.chat, userMsg];
    const tempLead = { ...lead, chat: updatedChat };
    updateLead(lead.id, { chat: updatedChat });
    onLeadUpdate(tempLead);
    // Don't clear question yet — preserve on failure

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          lead: {
            form: lead.form,
            analysis: lead.analysis ? {
              lead_summary: lead.analysis.lead_summary,
              customer_intent: lead.analysis.customer_intent,
              key_requirements: lead.analysis.key_requirements,
              objections: lead.analysis.objections,
              recommended_next_action: lead.analysis.recommended_next_action,
              suggested_response: lead.analysis.suggested_response,
            } : null,
            score: lead.score,
            chat: updatedChat.slice(-6).map((m) => ({ role: m.role, text: m.text })),
            promiseKeeper: lead.promiseKeeper,
          },
        }),
      });

      const payload: unknown = await response.json().catch(() => null);
      const data = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};

      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Couldn't get an answer. Please retry.");
      }

      if (typeof data.answer !== "string") throw new Error("Couldn't get an answer. Please retry.");

      const assistantMsg: ChatMessage = { role: "assistant", text: data.answer, at: new Date().toISOString() };
      const finalChat = [...updatedChat, assistantMsg];
      const finalLead = { ...lead, chat: finalChat };
      updateLead(lead.id, { chat: finalChat });
      onLeadUpdate(finalLead);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't get an answer. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">Chat</h2>

      {lead.chat.length === 0 && !loading && (
        <p className="mb-3 text-sm text-gray-400">Ask about this lead — e.g. &quot;what should I emphasize on the call?&quot;</p>
      )}

      <div className="mb-3 max-h-64 space-y-2 overflow-y-auto">
        {lead.chat.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.role === "user"
                ? "ml-8 bg-blue-50 text-blue-900"
                : "mr-8 bg-gray-100 text-gray-800"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="mr-8 animate-pulse rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-400">
            Thinking...
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="mb-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
          <button onClick={handleSend} className="ml-2 font-medium underline">Retry</button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this lead..."
          maxLength={500}
          disabled={loading}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </section>
  );
}
