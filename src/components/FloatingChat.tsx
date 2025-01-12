import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useQuery, useMutation, gql } from "@apollo/client";

const POST_QUESTION = gql`
  mutation ($question: String!, $thread_id: String) {
    postNeo4jQuestion(question: $question, thread_id: $thread_id) {
      response
      logs
      thread_id
    }
  }
`;

interface ChatMessage {
  type: "user" | "bot";
  content: string;
  status?: "pending" | "complete";
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 p-3 bg-gray-800 text-gray-100 rounded-lg max-w-[80%]">
    <div className="flex space-x-1">
      <div
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
    <span className="text-sm text-gray-400">AI is typing</span>
  </div>
);

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [postQuestion, { loading }] = useMutation(POST_QUESTION);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const variables: { question: string; thread_id?: string } = {
        question: userMessage,
      };

      if (threadId) {
        variables.thread_id = threadId;
      }

      // Add a small delay to show typing indicator (min 1 second)
      const responsePromise = postQuestion({ variables });
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

      const { data } = await responsePromise;
      await delayPromise; // Ensure minimum delay

      if (data.postNeo4jQuestion.thread_id) {
        setThreadId(data.postNeo4jQuestion.thread_id);
      }

      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: data.postNeo4jQuestion.response,
          status: "complete",
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I encountered an error processing your request.",
          status: "complete",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-black border border-purple-500 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">Ask Me Anything</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[380px] overflow-y-auto p-4 bg-black/95">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 ${
                  msg.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-purple-600 text-white ml-auto"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4">
                <TypingIndicator />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-gray-900 border-t border-gray-800"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-purple-600 text-white rounded-lg p-2 transition-colors duration-200 
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-purple-700"
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all duration-200 relative group"
      >
        <div className="absolute inset-0 bg-purple-500 rounded-full animate-pulse opacity-50 group-hover:opacity-75" />
        <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20" />
        <MessageCircle className="w-6 h-6 text-white relative z-10" />
      </button>
    </div>
  );
};

export default FloatingChat;
