import { Camera, Heart, ImagePlus, Sparkles, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const PHOTO_KEY = "little-miss-counter-us-photo";
const MAX_IMAGE_SIZE = 1280;
const IMAGE_QUALITY = 0.86;

const resizeImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
      };

      image.onerror = () => reject(new Error("Unable to read this image."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Unable to load this image."));
    reader.readAsDataURL(file);
  });

const UsPhotoSection = ({ showToast }) => {
  const [photo, setPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setPhoto(window.localStorage.getItem(PHOTO_KEY) || "");
  }, []);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Choose a photo for your little frame 💗");
      return;
    }

    setIsLoading(true);

    try {
      const imageData = await resizeImage(file);
      window.localStorage.setItem(PHOTO_KEY, imageData);
      setPhoto(imageData);
      showToast("Your little picture is saved privately 💗");
    } catch {
      showToast("That photo could not be saved yet.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearPhoto = () => {
    window.localStorage.removeItem(PHOTO_KEY);
    setPhoto("");
    showToast("The photo was removed from this device.");
  };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-lg border border-white/75 bg-white/52 p-4 shadow-soft backdrop-blur-2xl xs:p-5 md:p-6"
      aria-labelledby="us-photo-title"
    >
      <div className="absolute -right-12 top-10 h-32 w-32 rounded-full bg-peach-300/28 blur-3xl" />
      <div className="absolute -left-12 bottom-2 h-28 w-28 rounded-full bg-lavender-300/30 blur-3xl" />

      <div className="relative grid gap-4 md:grid-cols-[minmax(260px,0.85fr)_1fr] md:items-center">
        <div className="relative overflow-hidden rounded-lg border border-white/80 bg-gradient-to-br from-blush-100 via-white to-lavender-200 p-2 shadow-glass">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white/48">
            {photo ? (
              <img
                src={photo}
                alt="A saved picture of us"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/70 text-blush-500 shadow-soft">
                    <Camera size={26} aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-lg font-black text-cocoa-700">Add a picture of us</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-cocoa-600/75">
                    It stays quietly on this device.
                  </p>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cocoa-700/22 to-transparent" />
            <div className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/72 px-3 py-1 text-xs font-black text-blush-600 shadow-soft backdrop-blur-xl">
              us 💗
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-blush-100/72 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blush-600">
            <Sparkles size={14} aria-hidden="true" />
            Our little frame
          </p>
          <h2 id="us-photo-title" className="mt-3 text-2xl font-black leading-tight text-cocoa-700 md:text-3xl">
            Swamini
          </h2>
          <p className="mt-1 flex items-center gap-2 text-base font-black text-blush-600">
            <Heart size={17} fill="currentColor" aria-hidden="true" />
            miniiiii
          </p>
          <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-cocoa-600/78 md:text-base">
            A tiny place for one favorite picture of you two, kept private in this browser.
          </p>

          <div className="mt-5 flex flex-col gap-3 xs:flex-row">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
              aria-label="Choose a picture of us"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush-500 to-peach-300 px-5 text-sm font-black text-white shadow-glow outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400 disabled:cursor-wait disabled:opacity-70"
            >
              <ImagePlus size={17} aria-hidden="true" />
              {photo ? "Change Photo" : isLoading ? "Saving..." : "Add Photo"}
            </button>
            {photo && (
              <button
                type="button"
                onClick={clearPhoto}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blush-300/70 bg-white/58 px-5 text-sm font-black text-cocoa-600 shadow-soft outline-none transition hover:-translate-y-0.5 hover:text-blush-600 focus-visible:ring-2 focus-visible:ring-blush-400"
              >
                <X size={17} aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UsPhotoSection;
