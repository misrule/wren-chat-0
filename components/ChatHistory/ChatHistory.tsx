import NewChat from "../NewChat";
import Message from "../Message";
import UserMessage from "../Message/UserMessage/UserMessage";
import AssistantMessage from "../Message/AssistantMessage/AssistantMessage";

interface ChatMessage {
  _id: string;
  role: string;
  content: string;
}

type Props = {
  messages: ChatMessage[];
  incomingMessage: string;
  routeHasChanged: boolean;
};

export const ChatHistory = ({ messages, incomingMessage, routeHasChanged }: Props) => {
  return (
    
    <div className="flex flex-1 flex-col-reverse 
    overflow-y-auto text-white
    vertical_scroll ml-4 rounded-t-2xl">
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
            // <Message
            //   key={message._id}
            //   role={message.role}
            //   content={message.content}
            // />
            if (message.role === "user") {
              return <UserMessage key={message._id} 
                content={message.content} role={""} />;
            } else if (message.role === "assistant") {
              return <AssistantMessage key={message._id} 
                content={message.content} role={""} />;
            }
          })}

          {incomingMessage && (
            <div className="text-emerald-300">
            <Message role="assistant" content={`${'[bot]' + incomingMessage}`} />
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
