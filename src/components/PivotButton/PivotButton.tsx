import React from "react";
import { Wand2, Loader2 } from "lucide-react";

interface PivotButtonProps {
  isGenerating: boolean;
  isDisabled: boolean;
}

const PivotButton: React.FC<PivotButtonProps> = ({
  isGenerating,
  isDisabled,
}) => {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      data-tour="pivot-button"
      className={`
        w-full py-4 px-6 hover:cursor-pointer rounded-xl font-bold text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black
        ${
          isDisabled
            ? "bg-gray-100 dark:bg-dark-card text-gray-400 border-gray-300 dark:border-dark-border shadow-none cursor-not-allowed"
            : "bg-friends-yellow text-black hover:bg-yellow-400"
        }
      `}>
      {isGenerating ? (
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="animate-spin text-friends-purple" size={20} />
          <span>Pivot... Pivot!</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Wand2 size={20} />
          <span>PIVOT!</span>
        </div>
      )}
    </button>
  );
};

export default PivotButton;
