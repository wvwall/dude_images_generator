import { Camera, GalleryHorizontalEnd, Video } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type TabType = "images" | "videos";

interface MediaTabsProps {
  imagesCount: number;
  videosCount: number;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showSeeAll?: boolean;
  displayLimit?: number;
}

const MediaTabs: React.FC<MediaTabsProps> = ({
  imagesCount,
  videosCount,
  activeTab,
  onTabChange,
  showSeeAll = false,
  displayLimit,
}) => {
  const navigate = useNavigate();

  const getDisplayCount = (total: number) => {
    if (displayLimit && total > displayLimit) {
      return `${displayLimit} of ${total}`;
    }
    return String(total);
  };

  return (
    <div className="flex items-center gap-2 pb-4 mb-8 border-b-2 border-dashed border-friends-purple/70 dark:border-friends-yellow/70">
      <button
        onClick={() => onTabChange("images")}
        className={`px-3 py-1.5 cursor-pointer text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all ${
          activeTab === "images"
            ? "text-friends-yellow bg-friends-purple"
            : "text-friends-purple bg-friends-purple/10 hover:bg-friends-purple/20 dark:text-friends-yellow dark:bg-friends-yellow/10 dark:hover:bg-friends-yellow/20"
        }`}>
        <Camera size={14} />
        {getDisplayCount(imagesCount)} IMAGES
      </button>

      <button
        onClick={() => onTabChange("videos")}
        className={`px-3 py-1.5 cursor-pointer text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all ${
          activeTab === "videos"
            ? "text-friends-yellow bg-friends-purple"
            : "text-friends-purple bg-friends-purple/10 hover:bg-friends-purple/20 dark:text-friends-yellow dark:bg-friends-yellow/10 dark:hover:bg-friends-yellow/20"
        }`}>
        <Video size={14} />
        {getDisplayCount(videosCount)} VIDEOS
      </button>

      {showSeeAll && (
        <>
          <GalleryHorizontalEnd
            size={18}
            className="ml-auto text-black dark:text-white"
          />
          <button
            onClick={() => navigate("/gallery")}
            className="text-sm font-semibold hover:cursor-pointer text-black dark:text-white underline decoration-2 underline-offset-4 hover:text-friends-purple dark:hover:text-friends-yellow hover:brightness-110"
            title="See more">
            See all
          </button>
        </>
      )}
    </div>
  );
};

export default MediaTabs;
