import { useEffect, useRef, useState } from "react";
import { ApiError, askQuestionStream } from "../api/client";
import type { ChatMessage } from "../types";
import MessageBubble from "./MessageBubble";

interface ChatScreenProps {
  filename: string;
  onReset: () => void;
}

let idCounter = 0;
const nextId = () => `msg-${++idCounter}-${Date.now()}`;

export default function ChatScreen({ filename, onReset }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: "assistant",
      content: `"${filename}" is loaded. Ask me anything about it.`,
    },
  ]);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAsking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    const userMessage: ChatMessage = {
      id: nextId(),
      role: "user",
      content: trimmed,
    };
    const assistantId = nextId();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setQuestion("");
    setIsAsking(true);

    try {
      await askQuestionStream(
        trimmed,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        },
        { delayMs: 25, charsPerTick: 5 }
      );
    } catch (err) {
      const text =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: text, isError: true } : m
        )
      );
    } finally {
      setIsAsking(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAsking]);

  return (
    <div className="chat-stage">
      <header className="chat-stage__header">
        <div className="doc-tab">
          <span className="doc-tab__glyph" aria-hidden="true">
            ▤
          </span>
          <span className="doc-tab__name" title={filename}>
            {filename}
          </span>
        </div>
        <button className="text-button" onClick={onReset} type="button">
          Upload a different PDF
        </button>
      </header>

      <div className="chat-stage__history">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isAsking && <div className="message message--assistant">...</div>}
        <div ref={bottomRef} />
      </div>

      <form className="chat-stage__composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is this document about?"
          disabled={isAsking}
          autoFocus
        />
        <button type="submit" disabled={isAsking || !question.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
