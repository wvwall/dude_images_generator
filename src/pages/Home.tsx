import React, { useState, useCallback, useEffect, useRef } from "react";
import AspectRatioSelector from "../components/AspectRatioSelector";
import ImageHistory from "../components/ImageHistory";
import { generateImage } from "../services/geminiService";
import { AspectRatio, GeneratedImage } from "../types";
import * as sqliteService from "../services/sqliteService";
import {
  Wand2,
  Loader2,
  AlertCircle,
  Save,
  Armchair,
  Upload,
  ImagePlus,
  Type,
  X,
} from "lucide-react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New state for Image-to-Image mode
  const [mode, setMode] = useState<"text" | "image">("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) {
        setError("File too large! Please keep it under 4MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      let referenceImageBase64: string | undefined = undefined;

      if (mode === "image" && selectedFile) {
        referenceImageBase64 = await fileToBase64(selectedFile);
      }

      const imageUrl = await generateImage(
        prompt,
        aspectRatio,
        referenceImageBase64
      );

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
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Could not generate image. Please check API Key and Billing status."
      );
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
        const imgs = await sqliteService.getAllImages();
        setHistory(imgs);
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
      <main className="px-4 pt-10 mx-auto md:pt-20 max-w-7xl">
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

            <div className="relative flex flex-col flex-1 overflow-hidden bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
              <div className="absolute top-0 left-0 z-10 w-full h-1 bg-friends-yellow"></div>

              {/* Tab Switcher */}
              <div className="flex border-b-2 border-gray-100">
                <button
                  onClick={() => setMode("text")}
                  className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                    mode === "text"
                      ? "bg-white text-friends-purple"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}>
                  <Type size={18} />
                  Text
                </button>
                <div className="w-[2px] bg-gray-100"></div>
                <button
                  onClick={() => setMode("image")}
                  className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                    mode === "image"
                      ? "bg-white text-friends-purple"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}>
                  <ImagePlus size={18} />
                  Text + Image
                </button>
              </div>

              <form
                onSubmit={handleGenerate}
                className="flex flex-col flex-1 gap-6 p-6">
                {/* Image Upload Area (Only in Image Mode) */}
                {mode === "image" && (
                  <div className="space-y-3 duration-200 animate-in fade-in zoom-in-95">
                    <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
                      Your Reference
                    </label>

                    {!previewUrl ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center h-32 gap-2 transition-colors border-2 border-dashed cursor-pointer border-friends-purple/30 bg-friends-cream/30 rounded-xl hover:bg-friends-cream group">
                        <Upload
                          className="transition-transform text-friends-purple group-hover:scale-110"
                          size={24}
                        />
                        <span className="text-sm font-bold text-friends-purple">
                          Upload a photo to pivot
                        </span>
                        <span className="text-xs text-gray-500">
                          JPG or PNG, max 4MB
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-full h-32 overflow-hidden bg-gray-100 border-2 rounded-xl border-friends-purple">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/png, image/jpeg"
                      className="hidden"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
                    {mode === "image" ? "Modify it how?" : "The Prompt"}
                  </label>
                  <div className="relative group">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        mode === "image"
                          ? "Make it look like a comic book, add a turkey on the head..."
                          : "A couch in a fountain, 90s sitcom style, cozy coffee shop vibe..."
                      }
                      className="w-full min-h-[120px] p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-friends-purple focus:bg-white focus:ring-0 transition-all outline-none resize-none placeholder:text-gray-400"
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

                <div className="pt-2 mt-auto">
                  <button
                    type="submit"
                    disabled={
                      isGenerating ||
                      !prompt.trim() ||
                      (mode === "image" && !selectedFile)
                    }
                    className={`
                            w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black
                            ${
                              isGenerating ||
                              (mode === "image" && !selectedFile)
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
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-7/12 min-h[350px] sm:min-h-[500px] max-h-[600px] mt-[12px] ">
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
