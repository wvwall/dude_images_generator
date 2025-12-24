import React from "react";

interface ModelSelectorDropdownProps {
  model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
  setModel: (
    model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview"
  ) => void;
  mode: "text" | "image" | "video";
}

const ModelSelectorDropdown: React.FC<ModelSelectorDropdownProps> = ({
  model,
  setModel,
  mode,
}) => {
  const models = [
    { id: "gemini-2.5-flash-image", name: "Flash Image", icon: "⚡" },
    { id: "gemini-3-pro-image-preview", name: "Pro Image ", icon: "🚀" },
  ];

  if (mode === "video") {
    return null; // Don't show model selector for video mode
  }

  return (
    <div className="relative">
      <select
        value={model}
        onChange={(e) =>
          setModel(
            e.target.value as
              | "gemini-2.5-flash-image"
              | "gemini-3-pro-image-preview"
          )
        }
        className="block w-full px-2 py-2 pr-6 text-xs font-medium text-gray-700 border-2 border-gray-200 rounded-md shadow-sm appearance-none bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-friends-purple hover:border-friends-yellow hover:text-friends-purple hover:cursor-pointer">
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.icon} • {m.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ModelSelectorDropdown;
