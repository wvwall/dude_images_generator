import React from "react";
import { Square, Smartphone, Monitor, LayoutTemplate } from "lucide-react";
import { AspectRatio } from "@/src/types";

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  disabled?: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selected,
  onSelect,
  disabled,
}) => {
  const ratios: { value: AspectRatio; label: string; icon: React.ReactNode }[] =
    [
      { value: "1:1", label: "Square", icon: <Square size={16} /> },
      {
        value: "3:4",
        label: "Portrait",
        icon: <Smartphone size={16} className="rotate-0" />,
      },
      { value: "4:3", label: "Landscape", icon: <LayoutTemplate size={16} /> },
      { value: "16:9", label: "Wide", icon: <Monitor size={16} /> },
    ];

  return (
    <div className="flex flex-wrap gap-3" data-tour="aspect-ratio-selector">
      {ratios.map((ratio) => (
        <button
          key={ratio.value}
          type="button"
          onClick={() => onSelect(ratio.value)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 border-2
            ${
              selected === ratio.value
                ? "bg-friends-purple text-white border-friends-purple shadow-[3px_3px_0px_0px_rgba(244,196,48,1)]"
                : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-border hover:border-friends-purple dark:hover:border-friends-yellow hover:text-friends-purple dark:hover:text-friends-yellow"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}>
          {ratio.icon}
          <span>{ratio.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;
