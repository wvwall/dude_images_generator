import React from "react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  mode: "text" | "image" | "video";
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  mode,
}) => {
  return (
    <div className="space-y-3" data-tour="prompt-input">
      <label className="block text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 uppercase">
        {mode === "image" ? "Modify it how?" : "The Prompt"}
      </label>
      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "image"
              ? "Make it look like a comic book, add a turkey on the head..."
              : "A couch in a fountain, 90s sitcom style, cozy coffee shop vibe..."
          }
          className="w-full min-h-[120px] p-4 bg-gray-50 dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-xl text-gray-800 dark:text-gray-100 focus:border-friends-purple dark:focus:border-friends-yellow focus:bg-white dark:focus:bg-dark-surface focus:ring-0 transition-all outline-hidden resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={isGenerating}
        />
        <div className="absolute top-[-20px] flex items-center space-x-2 right-2">
          {prompt.length > 0 && (
            <button
              type="button"
              onClick={() => setPrompt("")}
              disabled={isGenerating}
              className="text-xs font-bold text-gray-400 hover:text-friends-red focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed">
              Clear
            </button>
          )}
          <span className="text-xs font-bold text-gray-400 group-focus-within:text-friends-purple dark:group-focus-within:text-friends-yellow">
            {prompt.length} chars
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
