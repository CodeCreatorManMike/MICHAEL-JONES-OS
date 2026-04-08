"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useIsNarrowScreen } from "@/hooks/useIsNarrowScreen";

const TEAL = "#2E8B8B";
const WINDOW_BG = "#C0C0C0";
const TITLEBAR = "#DDDDDD";
const SCROLLBAR_WIDTH = 16;
const ICONS_BASE = "/icons";

function DesktopIcon({
  label,
  iconFile,
  onDoubleClick,
  style,
}: {
  label: string;
  iconFile: string;
  onDoubleClick: () => void;
  style?: React.CSSProperties;
}) {
  const [imgError, setImgError] = useState(true);
  const lastTapRef = useRef(0);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const now = Date.now();
      if (now - lastTapRef.current < 420) {
        lastTapRef.current = 0;
        onDoubleClick();
      } else {
        lastTapRef.current = now;
      }
    },
    [onDoubleClick]
  );

  return (
    <button
      type="button"
      onDoubleClick={onDoubleClick}
      onPointerUp={onPointerUp}
      className="flex flex-col items-center w-16 max-w-[20vw] cursor-pointer bg-transparent border-0 p-1 hover:opacity-80 active:opacity-80"
      style={{ color: "#000", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", ...style }}
    >
      <span className="block w-8 h-8">
        <img
          src={`${ICONS_BASE}/${iconFile}.png`}
          alt=""
          width={32}
          height={32}
          className="object-contain w-8 h-8"
          style={{ display: imgError ? "none" : "block" }}
          onLoad={() => setImgError(false)}
          onError={() => setImgError(true)}
        />
      </span>
      <span className="text-xs text-center mt-0.5" style={{ maxWidth: 70 }}>
        {label}
      </span>
    </button>
  );
}

type WindowId =
  | "notePad"
  | "about"
  | "systemFolder"
  | "songs"
  | "contact"
  | "readme"
  | "blog"
  | "folder"
  | "listenNow"
  | "socialMedia";

const LISTEN_NOW_BASE = "/listen_now";

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_WIN_W = 200;
const MIN_WIN_H = 100;
const HANDLE = 6;

const TRACKS: { label: string; iconFile: string; audioFile: string }[] = [
  { label: "SIRENS", iconFile: "SIRENS ICON.png", audioFile: "SIRENS.wav" },
  { label: "HOTEL", iconFile: "HOTEL ICON.png", audioFile: "HOTEL.wav" },
  { label: "SINNER", iconFile: "SINNER ICON.png", audioFile: "SINNER.m4a" },
  { label: "ACTING MARVIN", iconFile: "ACTING MARVIN ICON.png", audioFile: "ACTING MARVIN.m4a" },
  { label: "TASTE BETTER", iconFile: "TASTE BETTER ICON.png", audioFile: "TASTE BETTER FINAL MIX.mp3" },
  { label: "1/10", iconFile: "1:10 ICON.png", audioFile: "1:10.wav" },
  { label: "DONT FEEL THE LUV", iconFile: "DONT FEEL THE LUV ICON.png", audioFile: "DONT FEEL THE LUV.m4a" },
  { label: "TIME ZONES", iconFile: "TIME ZONES ICON.png", audioFile: "TIME ZONES.wav" },
];

interface WindowState {
  id: WindowId;
  title: string;
  open: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

const MUSIC_VIDEOS_URL = "https://www.youtube.com/@Michael._.jones06/videos";
const PRESAVES_URL = "https://ffm.to/bewbe22";
const CONTACT_EMAIL = "michaeljonesincorporated@gmail.com";

const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://www.instagram.com/michael._.jones06/" },
  { name: "Tik Tok", url: "https://www.tiktok.com/@michael._.jones" },
  { name: "Youtube", url: "https://www.youtube.com/@Michael._.jones06" },
];

const DSP_LINKS = [
  { name: "Spotify", url: "https://open.spotify.com/artist/7vPEENQNWlxl161ulkNrZL" },
  { name: "Apple Music", url: "https://music.apple.com/gb/artist/michael-jones/1562042067" },
  { name: "Tidal", url: "https://tidal.com/artist/3504683" },
  { name: "Deezer", url: "https://www.deezer.com/us/artist/144382392" },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/B0921CMY4K/michael-jones" },
  { name: "SoundCloud", url: "https://soundcloud.com/user-79919738" },
  { name: "YouTube Music", url: "https://music.youtube.com/channel/UCPBK8fTtUUvW7AjACmtiuaQ" },
  { name: "iTunes", url: "https://music.apple.com/gb/artist/michael-jones/1562042067" },
  { name: "YouTube", url: "https://www.youtube.com/@Michael._.jones06" },
];

function ContactWindowContent() {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="flex-1 p-3 overflow-auto bg-white text-sm font-mono"
      style={{ color: "#000" }}
    >
      <p className="mb-2">Contact:</p>
      <button
        type="button"
        className="text-left cursor-pointer border-0 bg-transparent p-0 underline"
        style={{ color: "#0000ff" }}
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
      >
        email: {CONTACT_EMAIL}
      </button>
      <p className="mt-2 text-xs" style={{ color: copied ? "#000" : "#666" }}>
        {copied ? "Copied!" : "(click to copy)"}
      </p>
    </div>
  );
}

function MacMenuBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-2 flex-shrink-0 font-pixel text-sm"
      style={{
        height: 22,
        backgroundColor: "#fff",
        borderBottom: "2px solid #000",
      }}
    >
      <div className="flex items-center">
        <span className="font-bold">Michael Jones</span>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/4.png"
          alt=""
          width={18}
          height={18}
          className="object-contain flex-shrink-0"
          style={{ imageRendering: "pixelated" }}
        />
        <span>{time || "12:00 PM"}</span>
        <span className="cursor-pointer">?</span>
      </div>
    </div>
  );
}

function MacScrollbar({ vertical }: { vertical: boolean }) {
  const size = vertical ? SCROLLBAR_WIDTH : "100%";
  const height = vertical ? "100%" : SCROLLBAR_WIDTH;
  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{
        width: vertical ? SCROLLBAR_WIDTH : "auto",
        height,
        minHeight: vertical ? undefined : SCROLLBAR_WIDTH,
        backgroundColor: WINDOW_BG,
        border: "1px solid #000",
      }}
    >
      <div
        style={{
          width: vertical ? 14 : 14,
          height: vertical ? 14 : 14,
          border: "1px solid #000",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      />
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          border: "1px solid #000",
          margin: 1,
          backgroundColor: "#c0c0c0",
        }}
      >
        <div
          style={{
            width: vertical ? 10 : 40,
            height: vertical ? 40 : 10,
            backgroundColor: "#808080",
            border: "1px solid #000",
          }}
        />
      </div>
      <div
        style={{
          width: 14,
          height: 14,
          border: "1px solid #000",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

export default function MacDesktop() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: "notePad", title: "Note Pad", open: false, x: 80, y: 120, width: 320, height: 240, zIndex: 1 },
    { id: "about", title: "About This Computer", open: false, x: 420, y: 100, width: 340, height: 260, zIndex: 2 },
    { id: "systemFolder", title: "System Folder", open: false, x: 120, y: 380, width: 400, height: 280, zIndex: 3 },
    { id: "songs", title: "Music Links", open: false, x: 100, y: 100, width: 380, height: 320, zIndex: 4 },
    { id: "contact", title: "Contact", open: false, x: 200, y: 150, width: 340, height: 160, zIndex: 5 },
    { id: "readme", title: "README", open: false, x: 150, y: 120, width: 360, height: 280, zIndex: 6 },
    { id: "blog", title: "Blog", open: false, x: 180, y: 140, width: 340, height: 220, zIndex: 7 },
    { id: "folder", title: "Folder", open: false, x: 140, y: 200, width: 420, height: 300, zIndex: 8 },
    { id: "listenNow", title: "Listen Now", open: false, x: 100, y: 80, width: 440, height: 340, zIndex: 9 },
    { id: "socialMedia", title: "Social Media", open: false, x: 160, y: 100, width: 380, height: 220, zIndex: 10 },
  ]);
  const dragRef = useRef<{ windowId: WindowId; startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const resizeRef = useRef<{
    windowId: WindowId;
    edge: ResizeEdge;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    startLeft: number;
    startTop: number;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const folderTapTimesRef = useRef<Record<string, number>>({});
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const narrow = useIsNarrowScreen(640);
  const edgeHandle = narrow ? 14 : HANDLE;
  const cornerHandle = narrow ? 18 : HANDLE + 6;

  const focusWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      const target = prev.find((w) => w.id === id);
      if (!target || target.zIndex === maxZ) return prev;
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ } : w
      );
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, open: false } : w)));
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      return prev.map((w) =>
        w.id === id ? { ...w, open: true, zIndex: maxZ + 1 } : w
      );
    });
  }, []);

  const runFolderItemAction = useCallback(
    (item: {
      label: string;
      icon: string;
      windowId?: WindowId;
      isLink?: boolean;
      url?: string;
    }) => {
      if ("isLink" in item && item.isLink && item.url) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else if (item.windowId) {
        openWindow(item.windowId);
      }
    },
    [openWindow]
  );

  const handleTitleBarPointerDown = useCallback(
    (e: React.PointerEvent, id: WindowId) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      const w = windows.find((x) => x.id === id);
      if (!w) return;
      focusWindow(id);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      dragRef.current = {
        windowId: id,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: w.x,
        startTop: w.y,
      };
    },
    [windows, focusWindow]
  );

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent, id: WindowId, edge: ResizeEdge) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const w = windows.find((x) => x.id === id);
      if (!w) return;
      focusWindow(id);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      resizeRef.current = {
        windowId: id,
        edge,
        startX: e.clientX,
        startY: e.clientY,
        startW: w.width,
        startH: w.height,
        startLeft: w.x,
        startTop: w.y,
      };
    },
    [windows, focusWindow]
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (resizeRef.current) {
        const { windowId, edge, startX, startY, startW, startH, startLeft, startTop } = resizeRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const vw = typeof window !== "undefined" ? window.innerWidth : 4000;
        const vh = typeof window !== "undefined" ? window.innerHeight : 4000;

        setWindows((prev) =>
          prev.map((w) => {
            if (w.id !== windowId) return w;
            let newX = startLeft;
            let newY = startTop;
            let newW = startW;
            let newH = startH;
            if (edge.includes("e")) newW = Math.max(MIN_WIN_W, startW + dx);
            if (edge.includes("w")) {
              newW = Math.max(MIN_WIN_W, startW - dx);
              newX = startLeft + startW - newW;
            }
            if (edge.includes("s")) newH = Math.max(MIN_WIN_H, startH + dy);
            if (edge.includes("n")) {
              newH = Math.max(MIN_WIN_H, startH - dy);
              newY = startTop + startH - newH;
            }
            newW = Math.min(newW, vw - newX - 4);
            newH = Math.min(newH, vh - newY - 4);
            newX = Math.max(4, Math.min(newX, vw - newW - 4));
            newY = Math.max(4, Math.min(newY, vh - newH - 4));
            return { ...w, x: newX, y: newY, width: newW, height: newH };
          })
        );
        return;
      }
      if (!dragRef.current) return;
      const { windowId, startX, startY, startLeft, startTop } = dragRef.current;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? { ...w, x: startLeft + (e.clientX - startX), y: startTop + (e.clientY - startY) }
            : w
        )
      );
    };
    const up = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const MENU_BAR_H = 22;
  useEffect(() => {
    const pad = 4;
    const clampAll = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setWindows((prev) =>
        prev.map((w) => {
          let { x, y, width, height } = w;
          const maxW = Math.max(MIN_WIN_W, vw - pad * 2);
          const maxH = Math.max(MIN_WIN_H, vh - MENU_BAR_H - pad * 2);
          width = Math.min(Math.max(width, MIN_WIN_W), maxW);
          height = Math.min(Math.max(height, MIN_WIN_H), maxH);
          x = Math.min(Math.max(pad, x), vw - width - pad);
          y = Math.min(Math.max(pad + MENU_BAR_H, y), vh - height - pad);
          return { ...w, x, y, width, height };
        })
      );
    };
    clampAll();
    window.addEventListener("resize", clampAll);
    return () => window.removeEventListener("resize", clampAll);
  }, []);

  const openMusicVideos = useCallback(() => {
    window.open(MUSIC_VIDEOS_URL, "_blank", "noopener,noreferrer");
  }, []);

  const openPresaves = useCallback(() => {
    window.open(PRESAVES_URL, "_blank", "noopener,noreferrer");
  }, []);

  const playTrack = useCallback(
    (audioFile: string, label: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playingTrack === label) {
        audio.pause();
        audio.currentTime = 0;
        setPlayingTrack(null);
        return;
      }
      setPlayingTrack(label);
      audio.src = `${LISTEN_NOW_BASE}/${encodeURIComponent(audioFile)}`;
      audio.play().catch(() => setPlayingTrack(null));
    },
    [playingTrack]
  );

  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingTrack(null);
  }, []);

  const desktopIcons: Array<
    | { id: string; label: string; iconFile: string; windowId: WindowId }
    | { id: string; label: string; iconFile: string; onDoubleClick: () => void }
  > = [
    { id: "readme", label: "README", iconFile: "README_icon", windowId: "readme" },
    { id: "listen_now", label: "Listen Now", iconFile: "listen_now_icon", windowId: "listenNow" },
    { id: "songs", label: "Songs", iconFile: "song_icon", windowId: "songs" },
    { id: "presaves", label: "Presaves", iconFile: "presave_icon", onDoubleClick: openPresaves },
    { id: "music_videos", label: "Music Videos", iconFile: "music_videos_icon", onDoubleClick: openMusicVideos },
    { id: "folder", label: "Folder", iconFile: "folder_icon", windowId: "folder" },
    { id: "social_media", label: "Social Media", iconFile: "social_media_icon", windowId: "socialMedia" },
    { id: "contact", label: "Contact", iconFile: "contact_icon", windowId: "contact" },
    { id: "blog", label: "Blog", iconFile: "blog_icon", windowId: "blog" },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col font-pixel"
      style={{ backgroundColor: TEAL }}
    >
      <audio
        ref={audioRef}
        onEnded={stopTrack}
        style={{ display: "none" }}
      />
      <MacMenuBar />

      <div className="flex-1 relative overflow-hidden min-h-0">
        {/* Desktop icons: single column on wide screens; responsive grid on narrow so Trash never overlaps */}
        <div
          className={
            narrow
              ? "absolute z-[5] left-2 right-2 top-12 bottom-2 pb-safe grid grid-cols-3 auto-rows-min gap-x-1 gap-y-2 justify-items-center content-start overflow-y-auto overflow-x-hidden pointer-events-none [&>*]:pointer-events-auto"
              : "absolute z-[5] right-6 top-14 flex w-[5.5rem] flex-col items-end gap-2 max-h-[min(calc(100%-5rem),calc(100dvh-6rem))] overflow-y-auto overflow-x-hidden pointer-events-none [&>*]:pointer-events-auto pb-safe"
          }
        >
          {desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              label={icon.label}
              iconFile={icon.iconFile}
              onDoubleClick={() => ("windowId" in icon ? openWindow(icon.windowId) : icon.onDoubleClick())}
            />
          ))}
          <DesktopIcon label="Trash" iconFile="trash_icon_demos" onDoubleClick={() => {}} />
        </div>

        {/* Windows */}
        {windows
          .filter((w) => w.open)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((w) => (
            <div
              key={w.id}
              onClick={() => focusWindow(w.id)}
              className="absolute flex flex-col overflow-visible"
              style={{
                left: w.x,
                top: w.y,
                width: w.width,
                height: w.height,
                zIndex: w.zIndex,
                border: "2px solid #000",
                backgroundColor: WINDOW_BG,
              }}
            >
              {/* Title bar */}
              <div
                onPointerDown={(e) => handleTitleBarPointerDown(e, w.id)}
                className="flex items-center justify-center flex-shrink-0 cursor-move touch-none pl-6 pr-2 relative z-20 select-none"
                style={{
                  height: 22,
                  backgroundColor: TITLEBAR,
                  borderBottom: "1px solid #000",
                  touchAction: "none",
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(w.id);
                  }}
                  className="absolute left-0.5 top-0.5 w-4 h-4 flex items-center justify-center bg-transparent border-0 cursor-pointer p-0 z-40"
                  style={{ left: 2, top: 2 }}
                  aria-label="Close"
                >
                  <svg width={14} height={14} viewBox="0 0 14 14" className="overflow-visible" style={{ imageRendering: "pixelated" }}>
                    <line x1={1} y1={1} x2={13} y2={13} stroke="#000" strokeWidth={2} />
                    <line x1={13} y1={1} x2={1} y2={13} stroke="#000" strokeWidth={2} />
                  </svg>
                </button>
                <span className="text-sm font-bold">{w.title}</span>
              </div>

              {/* Content */}
              <div className="flex-1 flex overflow-hidden min-h-0">
                {w.id === "notePad" && (
                  <>
                    <div
                      className="flex-1 p-3 overflow-auto bg-white text-sm"
                      style={{ borderRight: "1px solid #000" }}
                    >
                      <p>Welcome. Music &amp; releases.</p>
                      <p className="mt-2">www.versionmuseum.com</p>
                      <p className="mt-4 text-xs">1</p>
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "about" && (
                  <div className="flex-1 p-4 overflow-auto text-sm">
                    <div className="flex gap-4 items-start">
                      <img
                        src={`${ICONS_BASE}/finder_icon.png`}
                        alt=""
                        width={48}
                        height={48}
                        className="flex-shrink-0 object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <div>
                        <p className="font-bold">Michael Jones Computer</p>
                        <p>Music &amp; content</p>
                        <p className="mt-2">Total Memory: 262,144K</p>
                        <p>Largest Unused Block: 259,623K</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 flex-1 border border-black max-w-[120px]"
                              style={{ backgroundColor: "#808080" }}
                            />
                            <span className="text-xs">Note Pad 210K</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 flex-1 border border-black max-w-[180px]"
                              style={{ backgroundColor: "#808080" }}
                            />
                            <span className="text-xs">System 2,286K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {w.id === "systemFolder" && (
                  <>
                    <div
                      className="flex-1 p-2 overflow-auto"
                      style={{ borderRight: "1px solid #000", borderBottom: "1px solid #000" }}
                    >
                      <p className="text-xs mb-2">15 items — 25.4 MB in disk — 72.9 MB available</p>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: "Menu Items", icon: "finder_icon" },
                          { label: "Control Panels", icon: "folder_icon" },
                          { label: "Finder", icon: "finder_icon" },
                          { label: "Fonts", icon: "file_icon" },
                          { label: "Shutdown Items", icon: "folder_icon" },
                          { label: "Launcher Items", icon: "presave_icon" },
                          { label: "Extensions", icon: "file_icon" },
                          { label: "Scrapbook File", icon: "README_icon" },
                        ].map(({ label, icon }) => (
                          <div key={label} className="flex flex-col items-center">
                            <img
                              src={`${ICONS_BASE}/${icon}.png`}
                              alt=""
                              width={40}
                              height={40}
                              className="w-10 h-10 object-contain flex-shrink-0"
                              style={{ imageRendering: "pixelated" }}
                            />
                            <span className="text-xs text-center mt-1">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "songs" && (
                  <>
                    <div
                      className="flex-1 p-3 overflow-auto bg-white text-sm font-mono"
                      style={{ borderRight: "1px solid #000", color: "#000" }}
                    >
                      <p className="mb-2">Music — listen on all platforms:</p>
                      {DSP_LINKS.map(({ name, url }) => (
                        <p key={name} className="mb-1">
                          {name}:{" "}
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            style={{ color: "#0000ff" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {url}
                          </a>
                        </p>
                      ))}
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "contact" && (
                  <ContactWindowContent />
                )}
                {w.id === "socialMedia" && (
                  <>
                    <div
                      className="flex-1 p-3 overflow-auto bg-white text-sm font-mono"
                      style={{ borderRight: "1px solid #000", color: "#000" }}
                    >
                      <p className="mb-2">Social — follow and watch:</p>
                      {SOCIAL_LINKS.map(({ name, url }) => (
                        <p key={name} className="mb-1">
                          {name}:{" "}
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            style={{ color: "#0000ff" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {url}
                          </a>
                        </p>
                      ))}
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "readme" && (
                  <>
                    <div
                      className="flex-1 p-3 overflow-auto bg-white text-sm font-mono"
                      style={{ borderRight: "1px solid #000", color: "#000" }}
                    >
                      <p className="mb-2">
                        Michael Jones is part of a new wave of artists reshaping the sound of alternative music. Emerging in 2025, the 19-year-old independent artist blends indie rock grit, hip hop swagger, and electronic pop polish into something raw, emotional, and sharply modern. His music lives in the tension between vulnerability and bravado, pulling listeners into honest coming-of-age stories backed by infectious, genre-blurring production.
                      </p>
                      <p className="mb-2">
                        Over the past year, Michael has rapidly built global traction, surpassing 50,000+ Spotify streams and landing on over 1,000 playlists.
                      </p>
                      <p className="mb-2">
                        Now based in London and collaborating with a new generation of rising producers, Michael is entering his most focused era yet. DONT FEEL THE LUV marks his boldest sound to date a sharp collision of electronic pop and hip hop that pushes his vision further than ever before. Within its first week the song had garnered over 4k streams and 250 playlists adds, adding to Michael&apos;s remarkable catalogue.
                      </p>
                      <p className="mb-2">
                        Every release builds the world wider.<br />
                        Every track hits harder.<br />
                        Michael Jones isn&apos;t just breaking through he&apos;s carving out his own lane.
                      </p>
                      <p>
                        For fans of The Kid LAROI + Dominic Fike + Jean Dawson + Justin Bieber + mgk
                      </p>
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "blog" && (
                  <>
                    <div
                      className="flex-1 p-3 overflow-auto bg-white text-sm font-mono"
                      style={{ borderRight: "1px solid #000", color: "#000" }}
                    >
                      <p className="mb-2">Blog</p>
                      <p>Updates and posts — coming soon.</p>
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "listenNow" && (
                  <>
                    <div
                      className="flex-1 p-2 overflow-auto"
                      style={{ borderRight: "1px solid #000" }}
                    >
                      <p className="text-xs mb-2">{TRACKS.length} items — click to play, stop to pause</p>
                      <div className="grid grid-cols-4 gap-3">
                        {TRACKS.map((track) => {
                          const isPlaying = playingTrack === track.label;
                          return (
                            <button
                              key={track.label}
                              type="button"
                              className="flex flex-col items-center cursor-pointer bg-transparent border-0 p-1 hover:opacity-90 relative"
                              onClick={() => playTrack(track.audioFile, track.label)}
                            >
                              <span className="relative block w-14 h-14">
                                <img
                                  src={`${LISTEN_NOW_BASE}/${encodeURIComponent(track.iconFile)}`}
                                  alt=""
                                  width={56}
                                  height={56}
                                  className="w-14 h-14 object-contain flex-shrink-0"
                                  style={{ imageRendering: "pixelated" }}
                                />
                                {isPlaying && (
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    style={{ backgroundColor: "rgba(0,0,0,0.5)", imageRendering: "pixelated" }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      stopTrack();
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        stopTrack();
                                      }
                                    }}
                                    aria-label="Stop"
                                  >
                                    <span
                                      style={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: "#fff",
                                        border: "2px solid #000",
                                        flexShrink: 0,
                                      }}
                                    />
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-center mt-1 font-bold" style={{ maxWidth: 80 }}>
                                {track.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
                {w.id === "folder" && (
                  <>
                    <div
                      className="flex-1 p-2 overflow-auto"
                      style={{ borderRight: "1px solid #000" }}
                    >
                      <p className="text-xs mb-2">9 items</p>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "README", icon: "README_icon", windowId: "readme" as WindowId },
                          { label: "Listen Now", icon: "listen_now_icon", windowId: "listenNow" as WindowId },
                          { label: "Songs", icon: "song_icon", windowId: "songs" as WindowId },
                          { label: "Presaves", icon: "presave_icon", isLink: true, url: PRESAVES_URL },
                          { label: "Music Videos", icon: "music_videos_icon", isLink: true, url: MUSIC_VIDEOS_URL },
                          { label: "Folder", icon: "folder_icon", windowId: "folder" as WindowId },
                          { label: "Social Media", icon: "social_media_icon", windowId: "socialMedia" as WindowId },
                          { label: "Contact", icon: "contact_icon", windowId: "contact" as WindowId },
                          { label: "Blog", icon: "blog_icon", windowId: "blog" as WindowId },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            className="flex flex-col items-center cursor-pointer bg-transparent border-0 p-1 hover:opacity-80"
                            style={{ touchAction: "manipulation" }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              runFolderItemAction(item);
                            }}
                            onPointerUp={(e) => {
                              if (e.pointerType === "mouse") return;
                              e.stopPropagation();
                              const key = item.label;
                              const now = Date.now();
                              const prev = folderTapTimesRef.current[key] ?? 0;
                              if (now - prev < 420) {
                                delete folderTapTimesRef.current[key];
                                runFolderItemAction(item);
                              } else {
                                folderTapTimesRef.current[key] = now;
                              }
                            }}
                          >
                            <img
                              src={`${ICONS_BASE}/${item.icon}.png`}
                              alt=""
                              width={40}
                              height={40}
                              className="w-10 h-10 object-contain flex-shrink-0"
                              style={{ imageRendering: "pixelated" }}
                            />
                            <span className="text-xs text-center mt-1">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <MacScrollbar vertical />
                  </>
                )}
              </div>

              {/* Edge and corner resize (classic Mac–style grow from any side) */}
              <div
                className="absolute inset-0 z-[30] pointer-events-none"
                aria-hidden
              >
                {(
                  [
                    ["n", { top: 0, left: edgeHandle, right: edgeHandle, height: edgeHandle, cursor: "ns-resize" }],
                    ["s", { bottom: 0, left: edgeHandle, right: edgeHandle, height: edgeHandle, cursor: "ns-resize" }],
                    ["w", { left: 0, top: edgeHandle, bottom: edgeHandle, width: edgeHandle, cursor: "ew-resize" }],
                    ["e", { right: 0, top: edgeHandle, bottom: edgeHandle, width: edgeHandle, cursor: "ew-resize" }],
                    ["nw", { top: 0, left: 0, width: cornerHandle, height: cornerHandle, cursor: "nwse-resize" }],
                    ["ne", { top: 0, right: 0, width: cornerHandle, height: cornerHandle, cursor: "nesw-resize" }],
                    ["sw", { bottom: 0, left: 0, width: cornerHandle, height: cornerHandle, cursor: "nesw-resize" }],
                    ["se", { bottom: 0, right: 0, width: cornerHandle, height: cornerHandle, cursor: "nwse-resize" }],
                  ] as const
                ).map(([edge, style]) => (
                  <div
                    key={edge}
                    className="absolute pointer-events-auto touch-none"
                    style={{ ...(style as React.CSSProperties), touchAction: "none" }}
                    onPointerDown={(e) => handleResizePointerDown(e, w.id, edge as ResizeEdge)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}