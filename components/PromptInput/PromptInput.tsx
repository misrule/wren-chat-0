import { useRef, useState } from "react";

interface PromptInputProps {
  newUserPrompt: (prompt: string) => void;
  generatingResponse: boolean;
}

export const PromptInput = ({
  newUserPrompt,
  generatingResponse,
}: PromptInputProps) => {

  const [userPrompt, setUserPrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const input = userPrompt;
    // TODO: Do we need any pre-processing/validation for userPrompt?
    await newUserPrompt(input);
    setUserPrompt("");
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevent the default action (new line)
      await handleSubmit();
    }
  };

  if (!generatingResponse && inputRef.current) {
    // FIXME: This is a hack to get the cursor to focus on the input field.
    // Not if this is the best way because it gets called on every render.
    // The goal is just to reset focus after a response is generated.
    inputRef.current.focus();
  }

  return (
    <div>
      <fieldset className="flex gap-2" disabled={generatingResponse}>
        <textarea
          ref={inputRef}
          value={generatingResponse ? "Thinking..." : userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full resize-none rounded-md bg-gray-700 p-2 text-white
        focus:border-emerald-500 focus:bg-gray-600 focus:outline-emerald-500"
          placeholder={generatingResponse ? "" : "Send a message..."}
        />
        <button className="btn" onClick={handleSubmit} disabled={!userPrompt}>
          Send
        </button>
      </fieldset>
    </div>
  );
};
