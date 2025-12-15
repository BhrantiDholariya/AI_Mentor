import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Brain, ArrowLeft, Sparkles, BookOpen, Lightbulb, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Message, ChatResponse } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

/* ---------------- Typing Indicator ---------------- */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
        <Brain className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex gap-1.5 py-4">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-purple-400/60 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Message Bubble ---------------- */

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-9 h-9 mr-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-purple-400" />
        </div>
      )}

      <div
        className={`max-w-[75%] ${
          isUser
            ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white px-5 py-3 rounded-2xl rounded-tr-md"
            : "text-gray-200 leading-relaxed"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

/* ---------------- Suggestions ---------------- */

const suggestionChips = [
  { icon: BookOpen, text: "Explain machine learning simply" },
  { icon: Lightbulb, text: "What are neural networks?" },
  { icon: Code, text: "How does AI generate images?" },
  { icon: Sparkles, text: "Tell me about AI ethics" },
];

function EmptyState({ onClick }: { onClick: (t: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Hello! I'm your AI Mentor.</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Ask me anything about AI, technology, and innovation.
      </p>
    </div>
  );
}

/* ---------------- Main Chat ---------------- */

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const res = await apiRequest("POST", "/api/chat", { message });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((p) => [
        ...p,
        { id: Date.now() + "-a", role: "assistant", content: data.response },
      ]);
    },
  });

  const sendMessage = () => {
    if (!input.trim() || chatMutation.isPending) return;

    setMessages((p) => [
      ...p,
      { id: Date.now() + "-u", role: "user", content: input },
    ]);

    chatMutation.mutate(input);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="h-16 border-b border-purple-500/10 flex items-center px-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div className="ml-3 flex items-center gap-2">
          <Brain className="text-purple-400" />
          <span className="font-semibold">AI Mentor</span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <EmptyState onClick={setInput} />
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              <AnimatePresence>
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </AnimatePresence>
              {chatMutation.isPending && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/10 p-4">
  <div className="max-w-3xl mx-auto">
    <div className="grid grid-cols-[1fr_auto] items-end gap-3">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Ask me anything about AI..."
        rows={1}
        className="min-h-[50px] max-h-32 resize-none p-[0.8rem] rounded-2xl bg-[#1a1a2e] border-purple-500/20"
      />

      <Button
        size="icon"
        onClick={sendMessage}
        disabled={!input.trim() || chatMutation.isPending}
        className="min-h-[50px] w-12 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </div>
</footer>

    </div>
  );
}
