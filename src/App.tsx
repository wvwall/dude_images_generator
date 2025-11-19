import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import AspectRatioSelector from "./components/AspectRatioSelector";
import ImageHistory from "./components/ImageHistory";
import { generateImage } from "./services/geminiService";
import { AspectRatio, GeneratedImage } from "./types";
import {
  Wand2,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Download,
} from "lucide-react";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: aspectRatio,
      };

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev]);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while creating your masterpiece. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((img) => img.id !== id));
      if (currentImage?.id === id) {
        setCurrentImage(null);
      }
    },
    [currentImage]
  );

  const handleDownloadCurrent = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = `dude-creation-${currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="pt-8 md:pt-12 px-4 max-w-5xl mx-auto flex flex-col gap-12">
        {/* Generator Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Input Column */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight">
                What would you like <br /> to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">
                  create today?
                </span>
              </h2>
              <p className="text-slate-500 text-lg font-light">
                Describe your vision and let Dude bring it to life.
              </p>
            </div>

            <form
              onSubmit={handleGenerate}
              className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  The Vision
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A serene garden with cherry blossoms at sunset, oil painting style..."
                  className="w-full min-h-[120px] p-4 rounded-xl bg-slate-50 border-slate-200 border focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Format
                </label>
                <AspectRatioSelector
                  selected={aspectRatio}
                  onSelect={setAspectRatio}
                  disabled={isGenerating}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-primary-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <span>Dreaming...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      <span>Generate Artwork</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>

          {/* Preview Column */}
          <div className="w-full lg:w-1/2">
            <div
              className={`
              relative w-full rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-200/60
              min-h-[400px] flex flex-col items-center justify-center
              ${isGenerating ? "animate-pulse" : ""}
            `}>
              {currentImage ? (
                <div className="relative group w-full h-full">
                  <img
                    src={currentImage.url}
                    alt="Generated result"
                    className="w-full h-auto object-contain max-h-[600px] bg-slate-50"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                    <button
                      onClick={handleDownloadCurrent}
                      className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-primary-50 transition-colors">
                      <Download size={16} />
                      Save Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 space-y-4 max-w-xs mx-auto">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <ImageIcon size={40} />
                  </div>
                  <h3 className="text-slate-900 font-medium text-lg">
                    Canvas Empty
                  </h3>
                  <p className="text-slate-500">
                    Your masterpiece will appear here once you start dreaming.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-primary-700 font-medium animate-pulse">
                    Creating magic...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ImageHistory images={history} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default App;
