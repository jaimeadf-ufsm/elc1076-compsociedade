import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isLoading?: boolean;
  token: number;
}

export interface LoadingStage {
  name: string;
  duration: number; // in milliseconds
}

interface ChatContextType {
  messages: Message[];
  isWelcomeVisible: boolean;
  currentStage: string;
  addMessage: (content: string, stages?: LoadingStage[]) => void;
  hideWelcome: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const TEXT_STAGES: LoadingStage[] = [
  { name: "Just a sec...", duration: 10000 },
];

const PRESENTATION_STAGES: LoadingStage[] = [
  { name: "Just a sec...", duration: 2000 },
  { name: "Defining the presentation scope...", duration: 4000 },
  { name: "Outlining the presentation structure...", duration: 4000 },
  { name: "Refining the presentation content...", duration: 4000 },
  { name: "Generating the presentation images...", duration: 12000 },
  { name: "Constructing the closing...", duration: 4000 },
];

const AI_RESPONSE =
  "I'm Gemini, a large language model trained by Google. I can help you with a variety of tasks, including answering questions, providing explanations, and generating text.";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [currentStage, setCurrentStage] = useState("");

  const addMessage = (content: string, stages?: LoadingStage[]) => {
    setCount(count + 1);

    if (!stages) {
      stages = TEXT_STAGES;

      console.log("count", count);

      if (count == 1) {
        stages = PRESENTATION_STAGES;
      }
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      token: count + 1,
    };

    // Add loading AI message
    const aiMessageId = (Date.now() + 1).toString();
    const loadingAiMessage: Message = {
      id: aiMessageId,
      content: "",
      isUser: false,
      isLoading: true,
      token: count + 1,
    };

    setMessages((prev) => [...prev, userMessage, loadingAiMessage]);
    setIsWelcomeVisible(false);

    // Process through loading stages
    let totalElapsed = 0;

    stages.forEach((stage, index) => {
      setTimeout(() => {
        setCurrentStage(stage.name);

        // If this is the last stage, complete loading after its duration
        if (index === stages.length - 1) {
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: AI_RESPONSE, isLoading: false }
                  : msg
              )
            );
            setCurrentStage("");
          }, stage.duration);
        }
      }, totalElapsed);

      totalElapsed += stage.duration;
    });
  };

  const hideWelcome = () => {
    setIsWelcomeVisible(false);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isWelcomeVisible,
        currentStage,
        addMessage,
        hideWelcome,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
