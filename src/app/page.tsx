"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import CountdownPhase from "@/components/CountdownPhase";
import TerminalBootPhase from "@/components/TerminalBootPhase";
import MacDesktop from "@/components/MacDesktop";

const ASCIIText = dynamic(() => import("@/components/ASCIIText"), {
  ssr: false,
});

type Phase = "start" | "countdown" | "boot" | "ascii" | "desktop";

const ASCII_DURATION_MS = 4500;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startExperience = useCallback(() => {
    if (phase !== "start") return;
    setPhase("countdown");
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
    }
  }, [phase]);

  useEffect(() => {
    const onInteraction = (e: Event) => {
      e.preventDefault();
      startExperience();
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
    if (phase === "start") {
      document.addEventListener("click", onInteraction);
      document.addEventListener("touchstart", onInteraction, { passive: false });
      document.addEventListener("keydown", onInteraction);
    }
    return () => {
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, [phase, startExperience]);

  const goBoot = useCallback(() => setPhase("boot"), []);
  const goAscii = useCallback(() => setPhase("ascii"), []);
  const goDesktop = useCallback(() => setPhase("desktop"), []);

  return (
    <main className="fixed inset-0 w-full h-full min-h-[100dvh]">
      <audio
        ref={audioRef}
        src="/untitled.mp3"
        playsInline
        style={{ display: "none" }}
        aria-label="Boot sound"
      />
      {phase === "start" && (
        <button
          type="button"
          className="fixed inset-0 w-full h-full min-h-[100dvh] bg-black cursor-default border-0 outline-none flex items-center justify-center px-4 pb-safe"
          onClick={startExperience}
          style={{ fontFamily: '"VCR OSD Mono", monospace', color: "#00ff41", fontSize: "clamp(14px, 3vw, 20px)" }}
          aria-label="Tap to start"
        >
          <span className="opacity-70">Tap or click to start</span>
        </button>
      )}
      {phase === "countdown" && <CountdownPhase onComplete={goBoot} />}

      {phase === "boot" && <TerminalBootPhase onComplete={goAscii} />}

      {phase === "ascii" && (
        <AsciiPhase durationMs={ASCII_DURATION_MS} onComplete={goDesktop} />
      )}

      {phase === "desktop" && <MacDesktop />}
    </main>
  );
}

function AsciiPhase({
  durationMs,
  onComplete,
}: {
  durationMs: number;
  onComplete: () => void;
}) {
  const [textFontSize, setTextFontSize] = useState(64);
  const [asciiFontSize, setAsciiFontSize] = useState(6);
  const [planeH, setPlaneH] = useState(3.2);

  useEffect(() => {
    const id = setTimeout(onComplete, durationMs);
    return () => clearTimeout(id);
  }, [durationMs, onComplete]);

  useEffect(() => {
    const apply = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      if (w < 420) {
        setTextFontSize(26);
        setAsciiFontSize(4);
        setPlaneH(2.4);
      } else if (w < 640) {
        setTextFontSize(40);
        setAsciiFontSize(5);
        setPlaneH(2.8);
      } else {
        setTextFontSize(64);
        setAsciiFontSize(6);
        setPlaneH(3.2);
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full min-h-[100dvh] bg-black">
      <ASCIIText
        text="MICHAEL JONES"
        enableWaves
        asciiFontSize={asciiFontSize}
        textFontSize={textFontSize}
        textColor="#00ff41"
        planeBaseHeight={planeH}
      />
    </div>
  );
}
