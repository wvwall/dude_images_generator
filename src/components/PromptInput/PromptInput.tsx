import React from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  mode: "text" | "image" | "video";
  // Enhancement props
  onEnhance?: () => void;
  isEnhancing?: boolean;
  enhancedPrompt?: string;
  showEnhancePanel?: boolean;
  onEnhancedPromptChange?: (prompt: string) => void;
  onApplyEnhanced?: () => void;
  onCancelEnhanced?: () => void;
  enhanceError?: string | null;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  mode,
  onEnhance,
  isEnhancing = false,
  enhancedPrompt = "",
  showEnhancePanel = false,
  onEnhancedPromptChange,
  onApplyEnhanced,
  onCancelEnhanced,
  enhanceError,
}) => {
  const canEnhance = prompt.trim().length > 0 && !isGenerating && !isEnhancing;

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
          className="w-full min-h-30 p-4 bg-gray-50 dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-xl text-gray-800 dark:text-gray-100 focus:border-friends-purple dark:focus:border-friends-yellow focus:bg-white dark:focus:bg-dark-surface focus:ring-0 transition-all outline-hidden resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={isGenerating || isEnhancing}
        />
        <div className="absolute -top-5 flex items-center space-x-2 right-2">
          {onEnhance && (
            <button
              type="button"
              onClick={onEnhance}
              disabled={!canEnhance}
              className="text-xs hover:cursor-pointer font-bold text-friends-purple dark:text-friends-yellow hover:text-friends-yellow dark:hover:text-friends-purple focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              title="Enhance prompt with AI">
              {isEnhancing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isEnhancing ? "Enhancing..." : "Enhance"}
            </button>
          )}
          {prompt.length > 0 && !isEnhancing && (
            <button
              type="button"
              onClick={() => setPrompt("")}
              disabled={isGenerating}
              className="text-xs hover:cursor-pointer font-bold text-gray-400 hover:text-friends-red focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed">
              Clear
            </button>
          )}
          <span className="text-xs font-bold text-gray-400 group-focus-within:text-friends-purple dark:group-focus-within:text-friends-yellow">
            {prompt.length} chars
          </span>
        </div>
      </div>

      {/* Enhancement Panel */}
      {showEnhancePanel && (
        <div className="duration-200 animate-in fade-in zoom-in-95 bg-friends-yellow-light dark:bg-dark-card border-2 border-friends-yellow dark:border-friends-yellow rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-friends-yellow">
              <Sparkles className="w-4 h-4" />
              Enhanced Prompt
            </div>
            {!isEnhancing && !enhanceError && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancelEnhanced}
                  className="px-2 sm:px-3 py-1.5 text-xs font-bold cursor-pointer text-gray-600 dark:text-gray-400 hover:text-friends-red dark:hover:text-friends-red transition-colors flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={onApplyEnhanced}
                  disabled={!enhancedPrompt.trim()}
                  className="px-2 sm:px-3 py-1.5 text-xs cursor-pointer font-bold bg-friends-purple dark:bg-friends-yellow text-white dark:text-gray-900 rounded-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Apply</span>
                </button>
              </div>
            )}
          </div>

          {isEnhancing ? (
            <div className="flex items-center justify-center py-4 text-amber-700 dark:text-friends-yellow">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm">Enhancing your prompt...</span>
            </div>
          ) : enhanceError ? (
            <div className="text-sm text-friends-red bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
              {enhanceError}
            </div>
          ) : (
            <textarea
              value={enhancedPrompt}
              onChange={(e) => onEnhancedPromptChange?.(e.target.value)}
              className="w-full min-h-20 p-2.5 bg-white dark:bg-dark-surface border border-amber-300 dark:border-friends-yellow/30 rounded-lg text-gray-800 dark:text-gray-100 focus:border-friends-yellow dark:focus:border-friends-yellow focus:ring-0 transition-all outline-hidden resize-none text-sm"
              placeholder="Enhanced prompt will appear here..."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PromptInput;
