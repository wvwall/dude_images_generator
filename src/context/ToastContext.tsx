import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface PendingDelete {
  id: string;
  type: "image" | "video";
  duration: number;
  startTime: number;
}

interface ScheduleDeleteParams {
  id: string;
  type: "image" | "video";
  duration?: number;
  onExecute: () => Promise<void>;
  onUndo: () => void;
}

interface ToastContextType {
  pendingDeletes: PendingDelete[];
  scheduleDelete: (params: ScheduleDeleteParams) => void;
  undoDelete: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pendingDeletes, setPendingDeletes] = useState<PendingDelete[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const undoCallbacksRef = useRef<Map<string, () => void>>(new Map());

  const scheduleDelete = useCallback(
    ({
      id,
      type,
      duration = 5000,
      onExecute,
      onUndo,
    }: ScheduleDeleteParams) => {
      undoCallbacksRef.current.set(id, onUndo);
      setPendingDeletes((prev) => [
        ...prev,
        { id, type, duration, startTime: Date.now() },
      ]);

      const timerId = setTimeout(async () => {
        try {
          await onExecute();
        } catch (err) {
          console.warn("Delete failed, restoring item", err);
          const undoFn = undoCallbacksRef.current.get(id);
          if (undoFn) undoFn();
        } finally {
          setPendingDeletes((prev) => prev.filter((d) => d.id !== id));
          timersRef.current.delete(id);
          undoCallbacksRef.current.delete(id);
        }
      }, duration);

      timersRef.current.set(id, timerId);
    },
    [],
  );

  const undoDelete = useCallback((id: string) => {
    const timerId = timersRef.current.get(id);
    if (timerId) clearTimeout(timerId);

    const onUndo = undoCallbacksRef.current.get(id);
    if (onUndo) onUndo();

    setPendingDeletes((prev) => prev.filter((d) => d.id !== id));
    timersRef.current.delete(id);
    undoCallbacksRef.current.delete(id);
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ pendingDeletes, scheduleDelete, undoDelete }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
