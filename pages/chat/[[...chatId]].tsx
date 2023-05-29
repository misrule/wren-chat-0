import Head from "next/head";
import { streamReader } from "openai-edge-stream";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { IncomingMessage, ServerResponse } from "http";
import ChatSidebar from "@/components/ChatSidebar";
import PromptInput from "@/components/PromptInput";
import ChatHistory from "@/components/ChatHistory";

import { ChatFunctionsProvider } from "@/context/ChatContext";

interface ChatMessage {
  _id: string;
  role: string;
  content: string;
}

interface Props {
  chatId: string;
  title: string;
  messages: ChatMessage[];
}

interface PromptInputProps {
  newUserPrompt: (prompt: string) => void;
  isGeneratingResponse: (generating: boolean) => void;
}

export default function Chat({ chatId, title, messages = [] }: Props) {
  // The id of the chat we're currently viewing.
  const [newChatId, setNewChatId] = useState<string | null>(null);

  // The new messages we recieve from the model during this session. This gets
  // concatenated with the persisted messages from previous sessions.
  const [newChatMessages, setNewChatMessages] = useState<ChatMessage[]>([]);

  // An accumulator for messages streaming from the model.
  const [incomingMessage, setIncomingMessage] = useState("");

  // The full message we send to the model, including the prompt and the user's message.
  const [fullMessage, setFullMessage] = useState("");

  // The initial chat-id we got from the server. We use this to track if the user
  // has navigated to a new chat while we're waiting for a response from the model.
  const [originalChatId, setOriginalChatId] = useState(chatId);

  // The prompt we send to the model.
  // const [userPrompt, setUserPrompt] = useState("");
  // Flag indicating whether we're waiting for a response from the model.
  const [generatingResponse, setGeneratingResponse] = useState(false);

  const routeHasChanged = originalChatId !== chatId;
  const router = useRouter();

  // When our chat id changes, reset the new chat messages
  useEffect(() => {
    setNewChatMessages([]);
    setNewChatId(null);
  }, [chatId]);

  // When we get a new model response, add it to the new chat messages
  useEffect(() => {
    if (!routeHasChanged && !generatingResponse && fullMessage) {
      setNewChatMessages((prevState) => [
        ...prevState,
        {
          _id: uuid(),
          role: "assistant",
          content: fullMessage,
        },
      ]);
      setFullMessage("");
    }
  }, [fullMessage, generatingResponse, routeHasChanged]);

  // If we're not waiting for a response and have a new chat id, redirect to that chat
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router]);

  /**
   * Send the user's prompt to the model and add the response to the chat history.
   * @param newPrompt
   * @returns
   */
  const handleNewUserPrompt = async (newPrompt: string) => {
    setGeneratingResponse(true);
    setOriginalChatId(chatId);

    // Add the user's prompt to the chat history.
    setNewChatMessages((prevState) => {
      const newMessages = [
        ...prevState,
        {
          _id: uuid(),
          role: "user",
          content: newPrompt,
        },
      ];
      return newMessages;
    });

    // Send the user's prompt to the model.
    const response = await fetch("/api/chat/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, prompt: newPrompt }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) return;

    const reader = data.getReader();
    let content = "";

    await streamReader(reader, (message) => {
      console.log("MESSAGE: ", message);

      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingMessage((s) => `${s}${message.content}`);
        content += message.content;
      }
    });
    setFullMessage(content);
    setIncomingMessage("");
    setGeneratingResponse(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    //console.log("DELETE-CHAT: ", chatId);
    const response = await fetch(`/api/chat/${chatId}`, {
      method: "DELETE"
    }); 
  }
  const handleEditChatName = async (newName: string) => {
    console.log("EDIT-CHAT-NAME: ", newName);
  }
  const handleShareChate = async (email: string) => {
    console.log("SHARE-CHAT: ", email);
  }

  const chatFunctions = {
    editChatName: handleEditChatName,
    deleteChat: handleDeleteChat,
    shareChat: handleShareChate
  }

  // List of all messages in this chat, including the new messages we've
  // recieved from the model during this session.
  const allMessages = [...messages, ...newChatMessages];

  return (
    <ChatFunctionsProvider functions={chatFunctions}>
    <div>
      <Head>
        <title>New Chat</title>
      </Head>

      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar chatId={chatId} />

        <div className="flex flex-col overflow-hidden bg-gray-700">
          <ChatHistory
            messages={allMessages}
            incomingMessage={incomingMessage}
            routeHasChanged={routeHasChanged}
          />

          <footer className="bg-gray-800 p-10">
            <PromptInput
              newUserPrompt={handleNewUserPrompt}
              generatingResponse={generatingResponse}
            />
          </footer>
        </div>
      </div>
    </div>
    </ChatFunctionsProvider>
  );
}
//
export const getServerSideProps = async (ctx: NextPageContext) => {
  const chatId = ctx.query.chatId?.[0] || null;

  // Check if URL has a valid chat id. If not, redirect to /chat.
  if (chatId) {
    // TODO: DRY this object id validation/redirect logic.
    let objectId;
    try {
      objectId = new ObjectId(chatId);
    } catch (e) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    // FIXME: The type-casting is gross. Is there a better way to do this?
    // Why would request/response be undefined?
    const request = ctx.req as IncomingMessage;
    const response = ctx.res as ServerResponse;

    // Check if chat exists and belongs to user. If not, redirect to /chat.
    const session = await getSession(request, response);
    const client = await clientPromise;
    const db = client.db("wren0");
    const chat = await db.collection("chats").findOne({
      _id: objectId,
      userId: session?.user?.sub,
    });

    if (!chat) {
      // Chat doesn't exist or doesn't belong to user.
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    // Chat exists and belongs to user. Return props.
    return {
      props: {
        chatId,
        title: chat?.title,
        messages: chat?.messages.map((message: any) => ({
          ...message,
          _id: uuid(),
        })),
      },
    };
  }

  // No chat id in URL. Redirect to /chat.
  return {
    props: {},
  };
};
