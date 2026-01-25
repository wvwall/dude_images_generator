import { useTour } from "@reactour/tour";
import React, { useEffect } from "react";
import ImageHistory from "../components/ImageHistory/ImageHistory";
import InputForm from "../components/InputForm";
import InputHeader from "../components/InputHeader/InputHeader";
import InputPanel from "../components/InputPanel/InputPanel";
import ModeSelector from "../components/ModeSelector/ModeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { useGenerationLogic } from "../hooks/useGenerationLogic";

const Home: React.FC = () => {
  const { setIsOpen } = useTour();
  const { state, actions } = useGenerationLogic();

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
            <ModeSelector mode={state.mode} setMode={actions.setMode} />
            <InputForm state={state} actions={actions} />
          </InputPanel>

          <PreviewPanel state={state} actions={actions} />
        </div>
        {(state.isLoadingHistory || state.history.length > 0) && (
          <ImageHistory
            images={state.history}
            onDelete={actions.handleDelete}
            onEdit={actions.handleEdit}
            isLoading={state.isLoadingHistory}
          />
        )}
      </main>
    </section>
  );
};

export default Home;
