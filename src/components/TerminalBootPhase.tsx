"use client";

import { useEffect, useState } from "react";

const MATRIX_GREEN = "#00ff41";
const BOOT_LINES: { text: string; delayMs: number }[] = [
  { text: "> INITIALIZING AUDIO SUBSYSTEM...", delayMs: 0 },
  { text: "> LOADING TRACK CATALOG...", delayMs: 180 },
  { text: "> SIRENS", delayMs: 380 },
  { text: "> HOTEL", delayMs: 520 },
  { text: "> SINNER", delayMs: 660 },
  { text: "> ACTING MARVIN", delayMs: 800 },
  { text: "> TASTE BETTER", delayMs: 940 },
  { text: "> 1/10", delayMs: 1080 },
  { text: "> DONT FEEL THE LUV", delayMs: 1220 },
  { text: "> TOMORROW", delayMs: 1360 },
  { text: "> RELEASES MODULE READY", delayMs: 1520 },
  { text: "> CONTENT ENGINE ONLINE", delayMs: 1680 },
  { text: "> BOOT SEQUENCE COMPLETE.", delayMs: 1840 },
];

export default function TerminalBootPhase({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach(({ text, delayMs }, i) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, text]);
        }, delayMs)
      );
    });
    const doneAt = BOOT_LINES[BOOT_LINES.length - 1].delayMs + 1000;
    timeouts.push(
      setTimeout(() => {
        onComplete();
      }, doneAt)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black p-6 md:p-10 overflow-hidden text-sm md:text-base"
      style={{
        color: MATRIX_GREEN,
        textShadow: `0 0 4px ${MATRIX_GREEN}`,
        fontFamily: '"VCR OSD Mono", monospace',
      }}
    >
      <div className="max-w-2xl space-y-0.5">
        {visibleLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <span className="inline-block w-3 h-4 align-middle bg-current" style={{ opacity: cursorVisible ? 1 : 0 }} />
      </div>
    </div>
  );
}
