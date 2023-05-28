import { useState } from "react";

interface PromptInputProps {
  newUserPrompt: (prompt: string) => void;
  generatingResponse: boolean;
}

export const PromptInput = ({
  newUserPrompt,
  generatingResponse,
}: PromptInputProps) => {
  // The prompt we send to the model.
  const [userPrompt, setUserPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = userPrompt;
    // TODO: Do we need any pre-processing/validation for userPrompt?
    await newUserPrompt(input);
    setUserPrompt("");
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};
