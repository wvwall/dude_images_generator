import React, { useState, useCallback, useEffect } from "react";
import AspectRatioSelector from "../components/AspectRatioSelector";
import ImageHistory from "../components/ImageHistory";
import { generateImage } from "../services/geminiService";
import { AspectRatio, GeneratedImage } from "../types";
import * as sqliteService from "../services/sqliteService";
import { Wand2, Loader2, AlertCircle, Save, Armchair } from "lucide-react";

const Home: React.FC = () => {
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

      try {
        await sqliteService.addImage(newImage);
      } catch (dbErr) {
        console.warn("Failed to persist image to local sqlite DB", dbErr);
      }

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
    async (id: string) => {
      try {
        await sqliteService.deleteImage(id);
      } catch (dbErr) {
        console.warn("Failed to delete image from local sqlite DB", dbErr);
      }

      setHistory((prev) => prev.filter((img) => img.id !== id));
      if (currentImage?.id === id) {
        setCurrentImage(null);
      }
    },
    [currentImage]
  );

  useEffect(() => {
    (async () => {
      try {
        await sqliteService.initDB();
        const imgs = await sqliteService.getAllImages();
        setHistory(imgs);
        // if (imgs.length > 0) setCurrentImage(imgs[0]);
      } catch (err) {
        console.warn("Failed to load images from local sqlite DB", err);
      }
    })();
  }, []);

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
    <div className="min-h-screen pb-12 font-sans bg-friends-purple-light">
      <main className="px-4 pt-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-stretch gap-8 lg:flex-row">
          {/* Input Panel */}
          <div className="flex flex-col w-full gap-6 lg:w-5/12">
            <div className="mb-2">
              <h2 className="mb-3 text-5xl text-gray-800 font-hand drop-shadow-sm">
                How you doin'?
              </h2>
              <p className="font-medium text-gray-600">
                Describe what you want to see, and we'll be there for you.
              </p>
            </div>

            <form
              onSubmit={handleGenerate}
              className="relative flex flex-col flex-1 gap-6 p-6 overflow-hidden bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-friends-yellow"></div>

              <div className="space-y-3">
                <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
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
                  <div className="absolute text-xs font-bold text-gray-400 bottom-3 right-3 group-focus-within:text-friends-purple">
                    {prompt.length} chars
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
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
                    w-full py-4 px-4 rounded-xl font-bold text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black
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
                <div className="flex items-start gap-3 p-4 text-sm font-medium border-2 border-red-100 bg-red-50 rounded-xl text-friends-red">
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
                  <div className="relative w-full h-full overflow-hidden border-8 border-white rounded-lg shadow-lg">
                    <img
                      src={currentImage.url}
                      alt="Generated result"
                      className="object-contain w-full h-full bg-gray-200"
                    />
                  </div>

                  <div className="absolute transition-opacity duration-300 opacity-0 top-10 right-10 group-hover:opacity-100">
                    <button
                      onClick={handleDownloadCurrent}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white transition-colors border-2 border-white rounded-full shadow-lg bg-friends-purple hover:bg-purple-800">
                      <Save size={18} />
                      Save This
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-sm p-12 mx-auto space-y-6 text-center">
                  <div className="w-24 h-24 bg-friends-yellow rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Armchair size={40} className="text-black" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-2xl text-friends-purple font-hand">
                      Oh. My. God.
                    </h3>
                    <p className="text-base font-medium text-gray-500">
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

export default Home;
