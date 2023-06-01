import NewChat from "../NewChat";
import { AssistantMessage, UserMessage, Message } from "../Message";

type Props = {
  messages: ChatMessage[];
  incomingMessage: string;
  routeHasChanged: boolean;
};

export const ChatHistory = ({
  messages,
  incomingMessage,
  routeHasChanged,
}: Props) => {
  return (
    <div
      className="vertical_scroll ml-4 flex 
    flex-1 flex-col-reverse overflow-y-auto
    overflow-x-hidden rounded-t-2xl text-white"
    >
      {/* INITIAL MESSAGE */}
      {messages.length === 0 && <NewChat />}

      {/* CHAT-HISTORY COMPONENT (Main Chat Window) */}
      {messages.length > 0 && (
        <div className="mb-auto">
          {/* TODO:Fix message scrolling.
                The flex and flex-col-reverse above, and this inner div are
                a hack to make the messages scroll to the bottom by default.
                Ideally, the messages should only scroll to the bottom when
                the user is *already* scrolled to the bottom, but that's a bit more
                complicated to implement.
              */}
          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <UserMessage
                  key={message._id}
                  content={message.content}
                  role={""}
                />
              );
            } else if (message.role === "assistant") {
              return (
                <AssistantMessage
                  key={message._id}
                  content={message.content}
                  role={""}
                />
              );
            }
          })}

          {incomingMessage && (
            <div className="text-emerald-300">
              <AssistantMessage role="assistant" content={incomingMessage} />
            </div>
          )}

          {/* TODO: Need a solution for this situation where the user navigates away from the chat
                while the model is sending the response. I think the solution is to just disallow it.
                (i.e. Disable the sidebar while the model is sending a response.) */}
          {incomingMessage && routeHasChanged && (
            <Message
              role="notice"
              content="One message at a time. Please allow responses to finish before sending another message."
            />
          )}
        </div>
      )}
    </div>
  );
};
