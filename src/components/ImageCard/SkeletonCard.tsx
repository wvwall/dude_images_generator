import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="p-3 pb-4 bg-white rounded-xl border-2 border-gray-200 shadow-md animate-pulse">
      {/* Aspect Ratio Box Skeleton */}
      <div className="w-full bg-gray-200 rounded-lg aspect-square"></div>

      <div className="px-1 mt-4">
        {/* Prompt Lines Skeleton */}
        <div className="flex gap-2 items-start">
          <div className="mt-1 w-4 h-4 bg-gray-200 rounded shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between items-center pt-3 mt-4 border-t border-gray-100">
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
          <div className="w-10 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
