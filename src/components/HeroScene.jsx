import { Canvas } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import HeartModel from "./HeartModel";
import { useMouseParallax } from "../hooks/useMouseParallax";

const canUseWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
};

const useSceneSettings = () => {
  const [settings, setSettings] = useState({
    webgl: false,
    lowPower: false,
    mobile: true,
    visible: true,
  });

  useEffect(() => {
    const memory = navigator.deviceMemory || 4;
    const update = () => {
      setSettings({
        webgl: canUseWebGL(),
        lowPower: (navigator.hardwareConcurrency || 4) <= 2 || memory <= 2,
        mobile: window.matchMedia("(max-width: 767px)").matches,
        visible: document.visibilityState === "visible",
      });
    };

    update();
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return settings;
};

const HeartFallback = () => (
  <div className="relative grid h-full min-h-[210px] place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-blush-100 via-white to-lavender-200">
    <div className="fallback-heart relative h-24 w-24 rotate-45 rounded-lg bg-gradient-to-br from-blush-400 to-peach-300 shadow-glow" />
    <span className="absolute left-[24%] top-[26%] text-2xl text-lavender-400/70">✦</span>
    <span className="absolute right-[24%] top-[34%] text-lg text-blush-400/70">✧</span>
    <span className="absolute bottom-[24%] left-[35%] text-xl text-peach-400/80">♥</span>
  </div>
);

const SceneContents = ({ mobile, reducedMotion, parallax }) => (
  <>
    <ambientLight intensity={1.15} />
    <directionalLight position={[3, 4, 5]} intensity={1.8} castShadow />
    <pointLight position={[-2.2, 1.8, 2.4]} intensity={1.2} color="#FFD6C9" />
    <pointLight position={[2.4, -1.4, 2.2]} intensity={0.8} color="#D9C6FF" />

    <Float
      speed={reducedMotion ? 0 : 1.1}
      rotationIntensity={reducedMotion ? 0 : 0.18}
      floatIntensity={reducedMotion ? 0 : 0.42}
    >
      <HeartModel parallax={parallax} reducedMotion={reducedMotion} />
    </Float>

    <Sparkles
      count={mobile ? 28 : 56}
      speed={reducedMotion ? 0 : 0.28}
      opacity={0.58}
      size={mobile ? 2.1 : 2.9}
      scale={mobile ? [3.4, 2.4, 2.2] : [4.6, 3.2, 2.8]}
      color="#F58FB1"
    />

    <mesh position={[0, -1.42, -0.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[0.82, 42]} />
      <meshBasicMaterial color="#F58FB1" transparent opacity={0.13} />
    </mesh>
  </>
);

const HeroScene = () => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const settings = useSceneSettings();
  const parallax = useMouseParallax(containerRef, reduceMotion || settings.mobile);
  const showFallback = !settings.webgl;

  return (
    <figure ref={containerRef} className="mx-auto w-full max-w-xl">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hero-scene-shell h-[220px] overflow-hidden rounded-lg border border-white/75 bg-white/44 shadow-glass backdrop-blur-2xl xs:h-[238px] md:h-[300px] lg:h-[320px]"
      >
        {showFallback ? (
          <HeartFallback />
        ) : (
          <Canvas
            shadows
            frameloop={settings.visible && !reduceMotion ? "always" : "demand"}
            dpr={settings.mobile ? [1, 1.2] : [1, 1.75]}
            camera={{ position: [0, 0, 4.7], fov: 42 }}
            gl={{
              antialias: !settings.mobile,
              alpha: true,
              powerPreference: settings.mobile ? "low-power" : "high-performance",
            }}
          >
            <color attach="background" args={["#FFF7FB"]} />
            <Suspense fallback={null}>
              <SceneContents
                mobile={settings.mobile}
                reducedMotion={reduceMotion || !settings.visible || settings.lowPower}
                parallax={parallax}
              />
            </Suspense>
          </Canvas>
        )}
      </motion.div>
      <figcaption className="mt-3 text-center text-sm font-bold text-cocoa-600/80">
        Every small thought counts. 💗
      </figcaption>
    </figure>
  );
};

export default HeroScene;
