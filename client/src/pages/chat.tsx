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

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3" data-testid="typing-indicator">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
        <Brain className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex items-center gap-1.5 py-4">
        <motion.div
          className="w-2.5 h-2.5 bg-purple-400/60 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2.5 h-2.5 bg-violet-400/60 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        />
        <motion.div
          className="w-2.5 h-2.5 bg-cyan-400/60 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: isUser ? 10 : 15, x: isUser ? 20 : 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center mr-3">
          <Brain className="w-4 h-4 text-purple-400" />
        </div>
      )}
      <div
        className={`max-w-[75%] ${
          isUser
            ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white px-5 py-3 rounded-2xl rounded-tr-md shadow-lg shadow-purple-500/20"
            : "text-gray-200 leading-relaxed"
        }`}
      >
        <p className="whitespace-pre-wrap text-base">{message.content}</p>
      </div>
    </motion.div>
  );
}

const suggestionChips = [
  { icon: BookOpen, text: "Explain machine learning simply" },
  { icon: Lightbulb, text: "What are neural networks?" },
  { icon: Code, text: "How does AI generate images?" },
  { icon: Sparkles, text: "Tell me about AI ethics" },
];

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full px-4 py-12"
      data-testid="empty-state"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2 text-center">
        Hello! I'm your AI Mentor.
      </h2>
      <p className="text-gray-400 text-center mb-8 max-w-md leading-relaxed">
        Ask me anything about AI, technology, and innovation. I'm here to help you learn and explore.
      </p>
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
        {suggestionChips.map((chip, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(chip.text)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a2e] border border-purple-500/20 text-gray-300 text-sm transition-all hover:border-purple-500/40 hover:bg-[#1f1f35]"
            data-testid={`suggestion-chip-${index}`}
          >
            <chip.icon className="w-4 h-4 text-purple-400" />
            <span>{chip.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSubmit = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: trimmedValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    chatMutation.mutate(trimmedValue);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [inputValue, chatMutation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-white">
      <header className="flex-shrink-0 h-16 border-b border-purple-500/10 flex items-center justify-between px-4 sm:px-6 bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-purple-500/10"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white" data-testid="text-app-title">
              AI Mentor
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Your Intelligent Learning Companion
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Online
        </span>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="flex flex-col gap-6 p-4 sm:p-6 pb-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </AnimatePresence>
                {chatMutation.isPending && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      <footer className="flex-shrink-0 border-t border-purple-500/10 bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about AI..."
                className="min-h-[56px] max-h-32 resize-none pr-14 text-base rounded-2xl bg-[#1a1a2e] border-purple-500/20 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/40 transition-all duration-200"
                rows={1}
                disabled={chatMutation.isPending}
                data-testid="input-message"
                aria-label="Type your message"
              />
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={!inputValue.trim() || chatMutation.isPending}
                className="absolute right-3 bottom-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-50"
                aria-label="Send message"
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}
