"use client";

import { useEffect } from "react";

/**
 * MetaMask and other extensions inject scripts that sometimes reject promises
 * ("Failed to connect to MetaMask"). This app does not use Web3. Suppress those
 * rejections so they do not surface in the Next.js dev overlay.
 */
export default function ExtensionErrorFilter() {
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      const msg =
        typeof r === "string"
          ? r
          : r && typeof r === "object" && "message" in r
            ? String((r as { message?: string }).message)
            : String(r);
      const s = msg.toLowerCase();
      if (s.includes("metamask") || s.includes("failed to connect to metamask")) {
        e.preventDefault();
      }
    };

    const onError = (e: ErrorEvent) => {
      const f = e.filename || "";
      if (f.includes("chrome-extension://") || f.includes("moz-extension://")) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError, true);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError, true);
    };
  }, []);

  return null;
}
