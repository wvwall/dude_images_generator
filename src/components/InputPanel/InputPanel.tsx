import React, { PropsWithChildren } from "react";

const InputPanel: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col w-full gap-6 lg:w-5/12">
      <div className="relative flex flex-col flex-1 overflow-hidden bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border shadow-lg rounded-2xl">
        <div className="absolute top-0 left-0 z-10 w-full h-1 bg-friends-yellow"></div>
        {children}
      </div>
    </div>
  );
};

export default InputPanel;
