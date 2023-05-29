import React, { ReactNode, useContext } from 'react';

interface ChatFunctions {
  editChatName: (newName: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  shareChat: (userId: string) => Promise<void>;
}

const ChatFunctionsContext = React.createContext<ChatFunctions>({
  editChatName: () => new Promise(() => {}),
  deleteChat: () => new Promise(() => {}),
  shareChat: () => new Promise(() => {}),
});

interface ChatContextProps {
  functions: ChatFunctions;
  children: ReactNode;
}

const ChatFunctionsProvider = ({ functions, children }: ChatContextProps) => {
  return (
    <ChatFunctionsContext.Provider value={functions}>
      {children}
    </ChatFunctionsContext.Provider>
  );
};

const useChatFunctions = () => useContext(ChatFunctionsContext);

export { ChatFunctionsProvider, useChatFunctions };
