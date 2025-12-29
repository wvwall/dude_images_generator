import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <h1 className="flex items-center gap-1 text-4xl tracking-wider text-black font-hand animate-pulse">
        D<span className="w-2 h-2 mt-2 rounded-full bg-friends-red"></span>U
        <span className="w-2 h-2 mt-2 rounded-full bg-friends-blue"></span>D
        <span className="w-2 h-2 mt-2 rounded-full bg-friends-yellow"></span>E
      </h1>
    </div>
  );
};

export default LoadingPage;
