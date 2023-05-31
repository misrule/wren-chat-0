import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface PromptInputProps {
  newUserPrompt: (prompt: string) => void;
  userMessages: ChatMessage[];
  generatingResponse: boolean;
}
// TODO: Add to user settings.
const MAX_TEXTAREA_ROWS = 8;

export const PromptInput = ({
  newUserPrompt,
  userMessages,
  generatingResponse,
}: PromptInputProps) => {
  const [userPrompt, setUserPrompt] = useState("");
  const messageIndex = useRef(userMessages.length);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messageIndex.current = userMessages.length;
  }, [userMessages]);

  const handleSubmit = async () => {
    const input = userPrompt;
    // TODO: Do we need any pre-processing/validation for userPrompt?
    await newUserPrompt(input);
    setUserPrompt("");
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    } else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) {
      e.preventDefault();
      if (messageIndex.current === 0) {
        setUserPrompt(userMessages[0].content);
      }
      if (messageIndex.current > 0) {
        messageIndex.current -= 1;
        setUserPrompt(userMessages[messageIndex.current].content);
      }
    } else if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
      e.preventDefault();
      if (messageIndex.current === userMessages.length - 1) {
        setUserPrompt(userMessages[userMessages.length - 1].content);
        messageIndex.current += 1;
      }
      if (messageIndex.current > userMessages.length - 1) {
        setUserPrompt("");
      }
      if (messageIndex.current < userMessages.length - 1) {
        messageIndex.current += 1;
        setUserPrompt(userMessages[messageIndex.current].content);
      }
    }
  };

  if (!generatingResponse && inputRef.current) {
    // FIXME: This is a hack to get the cursor to focus on the input field.
    // Not if this is the best way because it gets called on every render.
    // The goal is just to reset focus after a response is generated.
    inputRef.current.focus();
  }

  return (
<footer className="bg-gray-950 pl-4 pb-4 rounded-b-2xl">
    <div className="p-8 bg-gray-700 rounded-b-2xl">
      <fieldset className="flex gap-4" disabled={generatingResponse}>
        <TextareaAutosize
          ref={inputRef}
          className="w-full resize-none rounded-2xl bg-gray-800 px-6 py-4 text-white
          focus:border-emerald-500 focus:bg-gray-750 focus:outline-emerald-500
          "
          minRows={1}
          maxRows={MAX_TEXTAREA_ROWS}
          onHeightChange={() => {
            if (!userPrompt) {
              setUserPrompt("");
            }
          }}
          value={generatingResponse ? "Thinking..." : userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={generatingResponse ? "" : "Send a message..."}
        />
        <button className="text-white/80 text-lg rounded-xl
        btn m-1 border border-transparent 
        hover:border hover:border-white/30 hover:text-white" 
        onClick={handleSubmit} disabled={!userPrompt}
        >
          {/* <FontAwesomeIcon  icon={faPaperPlane} /> */}
          Send
        </button>
      </fieldset>

    </div>
    </footer>    
  );
};
