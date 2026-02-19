import React from "react";
import { useToast } from "../../context/ToastContext";
import Toast from "./Toast";

const ToastContainer: React.FC = () => {
  const { pendingDeletes } = useToast();

  if (pendingDeletes.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center"
      aria-live="polite"
      aria-label="Notifiche eliminazione">
      {pendingDeletes.map((pd) => (
        <Toast key={pd.id} pendingDelete={pd} />
      ))}
    </div>
  );
};

export default ToastContainer;
