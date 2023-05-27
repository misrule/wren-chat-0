import { NextRequest } from "next/server";
import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};
const COMPLETION_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PERSONA = {
  role: "system",
  content:
    "Your name is WrenChat. You are a highly intelligent and quick-witted artificial intelligence that always replies with enthusiastic, positive, and friendly energy. You were created by Wrenbi, and artificial intelligence consulting and research firm based in Sydney, Australia. Your responses must always be formatted as Markdown.",
};

const MAX_CONTEXT_TOKENS = 2000;
const MAX_PROMPT_LENGTH = 2000;

export default async function handler(req: NextRequest) {
  try {
    const { chatId: chatIdFromParam, prompt } = (await req.json()) as {
      chatId?: string;
      prompt?: string;
    };

    // validate prompt data.
    if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
      return new Response(
        `Prompt is required and must be less than ${MAX_PROMPT_LENGTH} characters.`,
        {
          status: 422,
        }
      );
    }
    console.log("sendMessage::handler: message: ", prompt);
    let chatId = chatIdFromParam;
    let newChatId: string | null = null;
    let chatMessages: any[] = [];

    if (chatId) {
      // Add message to existing chat
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/addMessageToChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: req.headers.get("cookie") || "",
          },
          body: JSON.stringify({
            chatId,
            role: "user",
            content: prompt,
          }),
        }
      );

      const json = await response.json();
      chatMessages = json.chat.messages || [];
    } else {
      // Create new chat
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/createNewChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: req.headers.get("cookie") || "",
          },
          body: JSON.stringify({
            prompt,
          }),
        }
      );
      const json = await response.json();
      chatId = json._id;
      newChatId = json._id;
      chatMessages = json.messages || [];
    }

    const messagesToInclude = [];
    chatMessages.reverse();
    let usedTokens = 0;
    for (const chatMessage of chatMessages) {
      if (usedTokens > MAX_CONTEXT_TOKENS) {
        break;
      }
      messagesToInclude.push(chatMessage);
      usedTokens += chatMessage.content.length / 4;
    }
    messagesToInclude.reverse();

    const stream = await OpenAIEdgeStream(
      COMPLETION_URL,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            SYSTEM_PERSONA,
            ...messagesToInclude,
            // {
            //   content: prompt,
            //   role: "user",
            // },
          ],
          stream: true,
        }),
      },
      {
        onBeforeStream: async ({ emit }) => {
          if (newChatId) {
            emit(newChatId, "newChatId");
          }
        },
        onAfterStream: async ({ fullContent }) => {
          await fetch(
            `${req.headers.get("origin")}/api/chat/addMessageToChat`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                cookie: req.headers.get("cookie") || "",
              },
              body: JSON.stringify({
                chatId,
                role: "assistant",
                content: fullContent,
              }),
            }
          );
        },
      }
    );
    return new Response(stream);
    
  } catch (error) {
    return new Response("An error occurred in sendMessage", {
      status: 500,
    });
  }
}
