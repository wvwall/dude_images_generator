import React, { useEffect, useRef, useState } from "react";

type Props = {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
};

const PullToRefresh: React.FC<Props> = ({ onRefresh, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number>(0);
  const [translate, setTranslate] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const THRESHOLD = 60; // px to trigger refresh
  const MAX_PULL = 140;

  const isEnabled =
    typeof window !== "undefined" &&
    "ontouchstart" in window &&
    window.innerWidth <= 768;

  useEffect(() => {
    if (!isEnabled) return;

    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (container.scrollTop > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      setPulling(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling) return;
      const currentY = e.touches[0].clientY;
      const delta = Math.max(0, currentY - startY.current);

      if (container.scrollTop > 0) {
        // if user scrolls inside, abort
        setTranslate(0);
        setPulling(false);
        return;
      }

      if (delta > 0) {
        e.preventDefault();
        // rubber-band effect
        const t = Math.min(MAX_PULL, delta * 0.6);
        setTranslate(t);
      }
    };

    const onTouchEnd = async () => {
      if (!pulling) return;
      setPulling(false);

      if (translate >= THRESHOLD) {
        // Trigger refresh
        setRefreshing(true);
        setTranslate(50); // small visible position while refreshing
        try {
          await onRefresh();
        } catch (err) {
          console.warn("PullToRefresh onRefresh failed:", err);
        }
        // animate back
        setRefreshing(false);
        setTranslate(0);
      } else {
        // just animate back
        setTranslate(0);
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart as any);
      container.removeEventListener("touchmove", onTouchMove as any);
      container.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [pulling, translate, refreshing, isEnabled, onRefresh]);

  if (!isEnabled) return <>{children}</>;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-auto"
      style={{ WebkitOverflowScrolling: "touch" }}>
      {/* Spinner overlay - absolutely positioned so it does not push content */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          transform: `translate(-50%, ${Math.min(translate, MAX_PULL)}px)`,
          top: "-40px",
          transition: refreshing
            ? "transform 180ms linear"
            : "transform 180ms linear, opacity 120ms linear",
          opacity: translate > 0 || refreshing ? 1 : 0,
        }}
        aria-hidden={!refreshing && translate === 0}>
        <div
          className={`w-6 h-6 text-gray-700 ${
            refreshing ? "animate-spin" : "transition-transform duration-200"
          }`}>
          <svg
            className="w-full h-full"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="90"
              strokeDashoffset="0"
              fill="none"
              strokeOpacity="0.25"
            />
            <path
              d="M45 25a20 20 0 0 0-20-20"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default PullToRefresh;
