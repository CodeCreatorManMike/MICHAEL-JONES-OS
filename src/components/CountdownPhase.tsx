"use client";

import { useEffect, useState } from "react";

const MATRIX_GREEN = "#00ff41";
const INITIAL_HOURS = 0;
const INITIAL_MINUTES = 0;
const INITIAL_SECONDS = 8;
const TICK_MS = 80;

export default function CountdownPhase({ onComplete }: { onComplete: () => void }) {
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [minutes, setMinutes] = useState(INITIAL_MINUTES);
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    const totalStart = INITIAL_HOURS * 3600 + INITIAL_MINUTES * 60 + INITIAL_SECONDS;
    let totalSeconds = totalStart;
    const interval = setInterval(() => {
      totalSeconds = Math.max(0, totalSeconds - 1);
      setHours(Math.floor(totalSeconds / 3600));
      setMinutes(Math.floor((totalSeconds % 3600) / 60));
      setSeconds(totalSeconds % 60);
      setColonVisible((v) => !v);
      if (totalSeconds === 0) {
        clearInterval(interval);
        onComplete();
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [onComplete]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const display = `${pad(hours)}${colonVisible ? ":" : " "}${pad(minutes)}${colonVisible ? ":" : " "}${pad(seconds)}`;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-end pr-[15%]"
      style={{ fontFamily: '"VCR OSD Mono", monospace' }}
    >
      <div
        className="text-6xl md:text-8xl tabular-nums tracking-widest"
        style={{
          color: MATRIX_GREEN,
          textShadow: `0 0 10px ${MATRIX_GREEN}, 0 0 20px ${MATRIX_GREEN}`,
        }}
      >
        {display}
      </div>
    </div>
  );
}
