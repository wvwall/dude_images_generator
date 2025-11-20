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
  Save,
  Armchair,
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
      setError("Could not generate image. Maybe the API key is on a break?");
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
    <div className="min-h-screen bg-friends-cream pb-12 font-sans">
      <Header />

      <main className="pt-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Input Panel */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            <div className="mb-2">
              <h2 className="text-4xl font-hand text-gray-800 mb-3 drop-shadow-sm">
                How you doin'?
              </h2>
              <p className="text-gray-600 font-medium">
                Describe what you want to see, and we'll be there for you.
              </p>
            </div>

            <form
              onSubmit={handleGenerate}
              className="flex-1 flex flex-col gap-6 bg-white border-2 border-gray-200 shadow-lg p-6 rounded-2xl relative overflow-hidden">
              {/* Decorative yellow frame dots */}
              <div className="absolute top-0 left-0 w-full h-1 bg-friends-yellow"></div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  The Prompt
                </label>
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A couch in a fountain, 90s sitcom style, cozy coffee shop vibe..."
                    className="w-full min-h-[140px] p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-friends-purple focus:bg-white focus:ring-0 transition-all outline-none resize-none placeholder:text-gray-400"
                    disabled={isGenerating}
                  />
                  <div className="absolute bottom-3 right-3 text-xs font-bold text-gray-400 group-focus-within:text-friends-purple">
                    {prompt.length} chars
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  The Shape
                </label>
                <AspectRatioSelector
                  selected={aspectRatio}
                  onSelect={setAspectRatio}
                  disabled={isGenerating}
                />
              </div>

              <div className="pt-4 mt-auto">
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`
                    w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black
                    ${
                      isGenerating
                        ? "bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed"
                        : "bg-friends-yellow text-black hover:bg-yellow-400"
                    }
                  `}>
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin text-friends-purple"
                        size={20}
                      />
                      <span>Pivot... Pivot!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Wand2 size={20} />
                      <span>Make it Happen!</span>
                    </div>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl text-friends-red flex items-start gap-3 text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-7/12 min-h-[500px]">
            <div
              className={`
              relative w-full h-full bg-white border-4 border-friends-purple rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-xl
              ${
                !currentImage
                  ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'
                  : ""
              }
            `}>
              {currentImage ? (
                <div className="relative w-full h-full p-6 group bg-gray-50">
                  <div className="w-full h-full border-8 border-white shadow-lg rounded-lg overflow-hidden relative">
                    <img
                      src={currentImage.url}
                      alt="Generated result"
                      className="w-full h-full object-contain bg-gray-200"
                    />
                  </div>

                  <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={handleDownloadCurrent}
                      className="bg-friends-purple text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-purple-800 transition-colors flex items-center gap-2 shadow-lg border-2 border-white">
                      <Save size={18} />
                      Save This
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 space-y-6 max-w-sm mx-auto">
                  <div className="w-24 h-24 bg-friends-yellow rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Armchair size={40} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-friends-purple font-hand text-2xl mb-2">
                      Oh. My. God.
                    </h3>
                    <p className="text-gray-500 text-base font-medium">
                      It's empty in here! Enter a prompt to start creating.
                    </p>
                  </div>
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
