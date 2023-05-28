import ChatSidebar from "@/components/ChatSidebar";
import Head from "next/head";
import { NextResponse } from "next/server";
import { streamReader } from "openai-edge-stream";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Message from "@/components/Message";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewChat from "@/components/NewChat";
import PromptInput from "@/components/PromptInput";

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
};

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


  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   handleNewUserPrompt(userPrompt);
  // };

  const allMessages = [...messages, ...newChatMessages];
  return (
    <div>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar chatId={chatId} />
        <div className="flex flex-col overflow-hidden bg-gray-700">

          <div className="flex flex-1 flex-col-reverse overflow-y-scroll text-white">
            
            {/* INITIAL MESSAGE */}
            {allMessages.length === 0 && !incomingMessage && (
              <NewChat />
            )}

            {/* CHAT-HISTORY COMPONENT (Main Chat Window) */}
            {allMessages.length > 0 && (
              <div className="mb-auto">
                {/* TODO:Fix message scrolling.
                The flex and flex-col-reverse above, and this inner div are
                a hack to make the messages scroll to the bottom by default.
                Ideally, the messages should only scroll to the bottom when
                the user is *already* scrolled to the bottom, but that's a bit more
                complicated to implement.
              */}
                {allMessages.map((message) => (
                  <Message
                    key={message._id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {incomingMessage && !routeHasChanged && (
                  <Message role="assistant" content={incomingMessage} />
                )}
                {incomingMessage && routeHasChanged && (
                  <Message
                    role="notice"
                    content="One message at a time. Please allow responses to finish before sending another message."
                  />
                )}
              </div>
            )}
          </div>

          {/* FOOTER COMPONENT (Message Input) */}
          <footer className="bg-gray-800 p-10">
            <PromptInput newUserPrompt={handleNewUserPrompt} generatingResponse={generatingResponse}/>
            {/* <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white
                  focus:border-emerald-500 focus:bg-gray-600 focus:outline-emerald-500"
                  placeholder={generatingResponse ? "" : "Send a message..."}
                />
                <button className="btn" type="submit">
                  Send
                </button>
              </fieldset>
            </form> */}

          </footer>

        </div>
      </div>
    </div>
  );
}
//  
export const getServerSideProps = async (ctx: any) => {
  const chatId = ctx.params?.chatId?.[0] || null;

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

    // Check if chat exists and belongs to user. If not, redirect to /chat.
    const session = await getSession(ctx.req, ctx.res);
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
