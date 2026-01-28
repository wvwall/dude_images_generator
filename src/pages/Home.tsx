import { useTour } from "@reactour/tour";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import ImageHistory from "../components/ImageHistory/ImageHistory";
import InputForm from "../components/InputForm";
import InputHeader from "../components/InputHeader/InputHeader";
import InputPanel from "../components/InputPanel/InputPanel";
import ModeSelector from "../components/ModeSelector/ModeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { useGenerationStore } from "../store/useGenerationStore";
import { useImagesQuery } from "../hooks/useImagesQuery";
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
  const files = useFileHandling();
  const video = useVideoGeneration();

  // Pass fileToBase64 to avoid duplicating useFileHandling inside actions
  const { handleGenerate, handleDelete, handleEdit, handleDownloadCurrent } =
    useGenerationActions(files.fileToBase64);

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
        {(isLoadingHistory || history.length > 0) && (
          <ImageHistory
            images={history}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={isLoadingHistory}
          />
        )}
      </main>
    </section>
  );
};

export default Home;
