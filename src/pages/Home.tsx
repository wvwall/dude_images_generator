import { useTour } from "@reactour/tour";
import React, { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ImageCard from "../components/ImageCard/ImageCard";
import VideoCard from "../components/VideoCard/VideoCard";
import MediaTabs from "../components/MediaTabs/MediaTabs";
import SkeletonCard from "../components/ImageCard/SkeletonCard";
import InputForm from "../components/InputForm";
import InputHeader from "../components/InputHeader/InputHeader";
import InputPanel from "../components/InputPanel/InputPanel";
import ModeSelector from "../components/ModeSelector/ModeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { useGenerationStore } from "../store/useGenerationStore";
import { useImagesQuery } from "../hooks/useImagesQuery";
import { useVideosQuery, useDeleteVideoMutation } from "../hooks/useVideosQuery";
import { useFileHandling } from "../hooks/useFileHandling";
import { useVideoGeneration } from "../hooks/useVideoGeneration";
import { useGenerationActions } from "../hooks/useGenerationActions";

const Home: React.FC = () => {
  const { setIsOpen } = useTour();

  // State — subscribe only to what's rendered
  const {
    prompt, setPrompt,
    aspectRatio, setAspectRatio,
    mode, setMode,
    model, setModel,
    isGenerating,
    currentImage,
    error,
    success,
  } = useGenerationStore(
    useShallow((s) => ({
      prompt: s.prompt,
      setPrompt: s.setPrompt,
      aspectRatio: s.aspectRatio,
      setAspectRatio: s.setAspectRatio,
      mode: s.mode,
      setMode: s.setMode,
      model: s.model,
      setModel: s.setModel,
      isGenerating: s.isGenerating,
      currentImage: s.currentImage,
      error: s.error,
      success: s.success,
    })),
  );

  const { data: history = [], isLoading: isLoadingHistory } = useImagesQuery();
  const { data: videoHistory = [], isLoading: isLoadingVideos } = useVideosQuery();
  const deleteVideoMutation = useDeleteVideoMutation();
  const files = useFileHandling();
  const video = useVideoGeneration();

  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  // Pass fileToBase64 to avoid duplicating useFileHandling inside actions
  const { handleGenerate, handleDelete, handleEdit, handleDownloadCurrent } =
    useGenerationActions(files.fileToBase64);

  const handleDeleteVideo = useCallback(async (id: string) => {
    try {
      await deleteVideoMutation.mutateAsync(id);
    } catch (err) {
      console.warn("Failed to delete video from backend", err);
    }
  }, [deleteVideoMutation]);

  useEffect(() => {
    const tourSeen = localStorage.getItem("tourSeen");
    if (!tourSeen) {
      setIsOpen(true);
    }
  }, [setIsOpen]);

  return (
    <section className="min-h-screen pb-24 font-sans bg-friends-purple-light dark:bg-dark-bg">
      <main className="px-4 pt-12 mx-auto max-w-7xl md:pt-16">
        <InputHeader />
        <div className="flex flex-col gap-8 mt-12 lg:items-start lg:flex-row">
          <InputPanel>
            <ModeSelector mode={mode} setMode={setMode} />
            <InputForm
              prompt={prompt}
              setPrompt={setPrompt}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              model={model}
              setModel={setModel}
              mode={mode}
              isGenerating={isGenerating}
              error={error}
              success={success}
              files={files}
              onGenerate={handleGenerate}
            />
          </InputPanel>

          <PreviewPanel
            currentImage={currentImage}
            videoStatus={video.videoStatus}
            videoProgress={video.videoProgress}
            completedVideoUri={video.completedVideoUri}
            onDownload={handleDownloadCurrent}
          />
        </div>
        {(isLoadingHistory || isLoadingVideos || history.length > 0 || videoHistory.length > 0) && (
          <div className="mt-8">
            <MediaTabs
              imagesCount={history.length}
              videosCount={videoHistory.length}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showSeeAll={true}
              displayLimit={3}
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === "images" ? (
                isLoadingHistory ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  history.slice(0, 3).map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))
                )
              ) : (
                isLoadingVideos ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                ) : videoHistory.length > 0 ? (
                  videoHistory.slice(0, 3).map((videoItem) => (
                    <VideoCard
                      key={videoItem.id}
                      video={videoItem}
                      onDelete={handleDeleteVideo}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-border border-dashed rounded-2xl">
                    <p className="text-xl text-gray-400 font-hand">
                      No videos yet...
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Select Video mode to create something!
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default Home;
