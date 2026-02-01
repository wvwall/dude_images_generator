import { useState, useCallback } from "react";
import { enhancePrompt as enhancePromptApi } from "../services/geminiService";

interface UsePromptEnhancementReturn {
  isEnhancing: boolean;
  enhancedPrompt: string;
  showPanel: boolean;
  error: string | null;
  enhance: (prompt: string) => Promise<void>;
  setEnhancedPrompt: (prompt: string) => void;
  apply: (setPrompt: (prompt: string) => void) => void;
  cancel: () => void;
}

export const usePromptEnhancement = (): UsePromptEnhancementReturn => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    setError(null);
    setShowPanel(true);

    try {
      const result = await enhancePromptApi(prompt);
      setEnhancedPrompt(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enhancement failed");
      setShowPanel(false);
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  const apply = useCallback(
    (setPrompt: (prompt: string) => void) => {
      if (enhancedPrompt.trim()) {
        setPrompt(enhancedPrompt);
      }
      setShowPanel(false);
      setEnhancedPrompt("");
      setError(null);
    },
    [enhancedPrompt]
  );

  const cancel = useCallback(() => {
    setShowPanel(false);
    setEnhancedPrompt("");
    setError(null);
  }, []);

  return {
    isEnhancing,
    enhancedPrompt,
    showPanel,
    error,
    enhance,
    setEnhancedPrompt,
    apply,
    cancel,
  };
};
