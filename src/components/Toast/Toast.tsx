import { Trash2, Undo2 } from "lucide-react";
import React from "react";
import { PendingDelete, useToast } from "../../context/ToastContext";

interface ToastProps {
  pendingDelete: PendingDelete;
}

const Toast: React.FC<ToastProps> = ({ pendingDelete }) => {
  const { undoDelete } = useToast();
  const { id, type, duration } = pendingDelete;

  const label = type === "video" ? "Video eliminato" : "Immagine eliminata";

  return (
    <div className="relative overflow-hidden flex items-center gap-3 min-w-72 max-w-sm bg-gray-900 dark:bg-dark-surface text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-700 dark:border-dark-border">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-friends-red/20 shrink-0">
        <Trash2 size={16} className="text-friends-red" />
      </div>

      <span className="flex-1 text-sm font-medium font-sans">{label}</span>

      <button
        onClick={() => undoDelete(id)}
        className="flex items-center gap-1.5 shrink-0 text-friends-yellow font-semibold text-sm hover:text-yellow-300 transition-colors hover:cursor-pointer"
        aria-label="Annulla eliminazione">
        <Undo2 size={14} />
        Annulla
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full bg-friends-yellow origin-left"
        style={{
          animationName: "shrink-progress",
          animationDuration: `${duration}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
        }}
      />
    </div>
  );
};

export default Toast;
