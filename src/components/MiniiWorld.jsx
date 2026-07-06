import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, useTexture } from "@react-three/drei";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlus, Maximize2, Trash2, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MAX_GALLERY_PHOTOS } from "../utils/storage";
import { resizeImageFile } from "../utils/imageUtils";
import HeartModel from "./HeartModel";

const MAX_WORLD_IMAGE_SIZE = 680;
const WORLD_IMAGE_QUALITY = 0.66;
const MAX_WORLD_PHOTO_SIZE = 300000;

const canUseWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
};

const placeholderFrames = [
  { id: "placeholder-one", color: "#F58FB1", x: -1 },
  { id: "placeholder-two", color: "#D9C6FF", x: 0 },
  { id: "placeholder-three", color: "#FFD6C9", x: 1 },
];

const getFrameTransform = (index, count, mobile) => {
  const radius = mobile ? (count === 1 ? 1.55 : 2.2) : 3.25;
  const angle = count === 1 ? 0 : (index / count) * Math.PI * 2;
  const y = count === 1 ? 0.18 : ((index % 3) - 1) * (mobile ? 0.34 : 0.42);

  return {
    position: [Math.sin(angle) * radius, y, Math.cos(angle) * radius],
    rotation: [0, angle, 0],
  };
};

const FrameBase = ({ children, width = 1.24, height = 1.54, selected, onSelect, transform }) => (
  <group
    position={transform.position}
    rotation={transform.rotation}
    scale={selected ? 1.18 : 1}
    onClick={(event) => {
      event.stopPropagation();
      onSelect();
    }}
  >
    <mesh position={[0, 0, -0.065]} castShadow receiveShadow>
      <boxGeometry args={[width + 0.18, height + 0.18, 0.08]} />
      <meshPhysicalMaterial
        color={selected ? "#FFD6C9" : "#FFF7FB"}
        roughness={0.28}
        metalness={0.04}
        clearcoat={0.76}
        clearcoatRoughness={0.18}
      />
    </mesh>
    <mesh position={[0, 0, -0.11]} scale={[1.08, 1.08, 1]}>
      <planeGeometry args={[width + 0.28, height + 0.28]} />
      <meshBasicMaterial color="#F58FB1" transparent opacity={selected ? 0.28 : 0.1} side={THREE.DoubleSide} />
    </mesh>
    {children}
  </group>
);

const TexturedFrame = ({ item, selected, onSelect, transform }) => {
  const texture = useTexture(item.src);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const image = texture.image || { width: 1, height: 1 };
  const aspect = image.width / image.height || 1;
  const width = aspect >= 1 ? 1.58 : 1.58 * aspect;
  const height = aspect >= 1 ? 1.58 / aspect : 1.58;

  return (
    <FrameBase width={width} height={height} selected={selected} onSelect={onSelect} transform={transform}>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </FrameBase>
  );
};

const PlaceholderFrame = ({ item, selected, onSelect, transform }) => (
  <FrameBase selected={selected} onSelect={onSelect} transform={transform}>
    <mesh position={[0, 0, 0.006]}>
      <planeGeometry args={[1.24, 1.54]} />
      <meshBasicMaterial color={item.color} transparent opacity={0.72} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0, 0.018]} scale={[0.38, 0.38, 1]}>
      <circleGeometry args={[0.5, 42]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.62} side={THREE.DoubleSide} />
    </mesh>
  </FrameBase>
);

const GalleryOrbit = ({ items, selectedId, onSelect, reducedMotion, mobile }) => {
  const group = useRef();

  useFrame((_, delta) => {
    if (!group.current || reducedMotion || selectedId) return;
    group.current.rotation.y += delta * 0.075;
  });

  return (
    <group ref={group}>
      {items.map((item, index) => {
        const transform = getFrameTransform(index, items.length, mobile);
        const selected = item.id === selectedId;

        return item.src ? (
          <TexturedFrame
            key={item.id}
            item={item}
            selected={selected}
            onSelect={() => onSelect(item.id)}
            transform={transform}
          />
        ) : (
          <PlaceholderFrame
            key={item.id}
            item={item}
            selected={selected}
            onSelect={() => onSelect(item.id)}
            transform={transform}
          />
        );
      })}
    </group>
  );
};

const MiniiWorldScene = ({ photos, activeId, setActiveId, reducedMotion }) => {
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const items = photos.length ? photos : placeholderFrames;

  useEffect(() => {
    const update = () => setMobile(window.matchMedia("(max-width: 767px)").matches);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Canvas
      shadows
      className="minii-world-canvas"
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, mobile ? 0.75 : 0.9, mobile ? 6.2 : 6.7], fov: mobile ? 54 : 48 }}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: mobile ? "low-power" : "high-performance",
      }}
      onPointerMissed={() => setActiveId(null)}
    >
      <ambientLight intensity={1.65} />
      <directionalLight position={[3.4, 4.2, 4.6]} intensity={1.35} castShadow />
      <pointLight position={[-3.2, 1.4, 2.6]} intensity={1.8} color="#FFD6C9" />
      <pointLight position={[2.8, -0.9, 3.2]} intensity={1.1} color="#D9C6FF" />

      <Suspense fallback={null}>
        <GalleryOrbit
          items={items}
          selectedId={activeId}
          onSelect={setActiveId}
          reducedMotion={reducedMotion}
          mobile={mobile}
        />
        <Float
          speed={reducedMotion ? 0 : 0.85}
          rotationIntensity={reducedMotion ? 0 : 0.16}
          floatIntensity={reducedMotion ? 0 : 0.32}
        >
          <group position={[0, -1.24, 0]} scale={0.34}>
            <HeartModel reducedMotion={reducedMotion} />
          </group>
        </Float>
        <Sparkles
          count={mobile ? 52 : 92}
          speed={reducedMotion ? 0 : 0.34}
          opacity={0.58}
          size={mobile ? 2.2 : 3.1}
          scale={mobile ? [5.2, 3.4, 5.2] : [7.4, 4.5, 7.4]}
          color="#F58FB1"
        />
      </Suspense>

      <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.15, 3.2, 96]} />
        <meshBasicMaterial color="#FFD6C9" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        rotateSpeed={0.58}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.85}
      />
    </Canvas>
  );
};

const MiniiWorld = ({
  open,
  photo,
  galleryPhotos,
  syncStatus,
  onClose,
  onAddGalleryPhotos,
  onRemoveGalleryPhoto,
  showToast,
}) => {
  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const inputRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const photos = useMemo(
    () => [
      ...(photo ? [{ id: "our-main-frame", src: photo, createdAt: "", pinned: true }] : []),
      ...galleryPhotos,
    ],
    [galleryPhotos, photo],
  );

  useEffect(() => {
    setWebgl(canUseWebGL());
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!photos.some((item) => item.id === activeId)) setActiveId(photos[0]?.id || null);
  }, [activeId, photos]);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const availableSlots = MAX_GALLERY_PHOTOS - galleryPhotos.length;
    if (availableSlots <= 0) {
      showToast("Minii World is full for now.");
      return;
    }

    setIsLoading(true);

    try {
      const imageFiles = files.filter((file) => file.type.startsWith("image/")).slice(0, availableSlots);
      const resizedPhotos = [];

      for (const file of imageFiles) {
        const imageData = await resizeImageFile(file, {
          maxSize: MAX_WORLD_IMAGE_SIZE,
          quality: WORLD_IMAGE_QUALITY,
        });

        if (imageData.length <= MAX_WORLD_PHOTO_SIZE) resizedPhotos.push(imageData);
      }

      if (!resizedPhotos.length) {
        showToast("Try smaller photos for the 3D world.");
        return;
      }

      const addedPhotos = onAddGalleryPhotos(resizedPhotos);
      setActiveId(addedPhotos[0]?.id || activeId);
      showToast(
        syncStatus === "synced"
          ? "New memories are entering Minii World."
          : "New memories are saved here.",
      );
    } catch {
      showToast("Those photos could not enter Minii World yet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (photoId) => {
    onRemoveGalleryPhoto(photoId);
    showToast(syncStatus === "synced" ? "That memory left both phones." : "That memory left this phone.");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-hidden bg-blush-50 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="minii-world-title"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(255,191,212,0.58),transparent_28%),radial-gradient(circle_at_76%_28%,rgba(217,198,255,0.58),transparent_32%),linear-gradient(145deg,#fff7fb_0%,#f2eaff_48%,#ffe6dd_100%)]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cocoa-700/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-cocoa-700/22 to-transparent" />

          {webgl ? (
            <MiniiWorldScene
              photos={photos}
              activeId={activeId}
              setActiveId={setActiveId}
              reducedMotion={reduceMotion}
            />
          ) : (
            <div className="relative grid h-full place-items-center px-5">
              <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
                {photos.map((item) => (
                  <img
                    key={item.id}
                    src={item.src}
                    alt=""
                    className="max-h-[36dvh] rounded-lg border border-white/70 object-contain shadow-glass"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-[calc(1rem+env(safe-area-inset-top))] md:px-6">
            <div className="pointer-events-auto flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cocoa-600/78">
                  3D memory space
                </p>
                <h2 id="minii-world-title" className="text-2xl font-black leading-tight text-cocoa-700 md:text-4xl">
                  Minii World
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFiles}
                  aria-label="Add photos to Minii World"
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isLoading || galleryPhotos.length >= MAX_GALLERY_PHOTOS}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/68 px-4 text-sm font-black text-cocoa-700 shadow-soft backdrop-blur-xl outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <ImagePlus size={17} aria-hidden="true" />
                  {isLoading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/68 text-cocoa-700 shadow-soft backdrop-blur-xl outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400"
                  aria-label="Close Minii World"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {photos.length === 0 && (
            <div className="pointer-events-none absolute inset-x-6 top-1/2 z-10 -translate-y-1/2 text-center">
              <div className="mx-auto max-w-sm rounded-lg border border-white/70 bg-white/62 p-5 text-cocoa-700 shadow-glass backdrop-blur-2xl">
                <Maximize2 className="mx-auto text-blush-500" size={24} aria-hidden="true" />
                <p className="mt-3 text-lg font-black">Add a few memories</p>
              </div>
            </div>
          )}

          {photos.length > 0 && (
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-6">
              <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto rounded-full border border-white/70 bg-white/62 p-2 shadow-glass backdrop-blur-2xl">
                {photos.map((item) => (
                  <div key={item.id} className="group relative h-16 w-16 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={`h-16 w-16 overflow-hidden rounded-full border-2 bg-white outline-none transition focus-visible:ring-2 focus-visible:ring-blush-400 ${
                        item.id === activeId ? "border-blush-500" : "border-white"
                      }`}
                      aria-label="Select memory"
                    >
                      <img src={item.src} alt="" className="h-full w-full object-cover" />
                    </button>
                    {!item.pinned && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRemove(item.id);
                        }}
                        className="absolute inset-0 grid place-items-center rounded-full bg-cocoa-700/54 text-white opacity-0 outline-none transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blush-400"
                        aria-label="Remove memory"
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniiWorld;
