import { TourProvider } from "@reactour/tour";
import React from "react";
import { steps } from "./steps";

interface FeatureTourProps {
  children: React.ReactNode;
}

const FeatureTour: React.FC<FeatureTourProps> = ({ children }) => {
  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#fefcbf",
          borderRadius: "1rem",
          border: "2px solid #2d2d2d",
          boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
          padding: "1.5rem",
          maxWidth: "350px",
        }),
        dot: (base, { current }) => ({
          ...base,
          backgroundColor: current ? "#5D3F6A" : "#F4C430",
          border: "1px solid #2d2d2d",
          width: "12px",
          height: "12px",
        }),
      }}
      showNavigation={true}
      showDots={true}
      showCloseButton={true}
      scrollSmooth={true}
      showBadge={false}>
      {children}
    </TourProvider>
  );
};

export default FeatureTour;
