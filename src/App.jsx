import React, { useEffect } from "react";
import parse from "html-react-parser";
import markup from "./markup.html?raw";

function setBodyDataset() {
  document.body.setAttribute("data-streamer-slug", "takuu");
  document.body.setAttribute("data-storage-namespace", "takuu");
  document.body.setAttribute(
    "data-channel-avatar-fallback",
    "https://files.kick.com/images/user/196056/profile_image/conversion/5ed75600-4d1e-40ed-afb8-b2731a02ba10-fullsize.webp"
  );
  document.body.setAttribute("data-licznik-77-logo-url", "/img/default_profile.png");
}

async function bootstrapLegacyModules(cancelledRef) {
  const hlsModule = await import("hls.js");
  if (cancelledRef.cancelled) {
    return;
  }

  const Hls = hlsModule && hlsModule.default ? hlsModule.default : null;
  if (Hls && !window.Hls) {
    window.Hls = Hls;
  }

  await import("./legacy/discord-legacy.js");
  if (cancelledRef.cancelled) {
    return;
  }

  await import("./legacy/script-legacy.js");
}

export default function App() {
  useEffect(() => {
    setBodyDataset();

    if (window.__TAKUU_LEGACY_BOOTSTRAPPED__) {
      return;
    }

    window.__TAKUU_LEGACY_BOOTSTRAPPED__ = true;

    const cancelledRef = { cancelled: false };

    const loadLegacyModules = async () => {
      try {
        await bootstrapLegacyModules(cancelledRef);
      } catch (error) {
        console.error(error);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelledRef.cancelled) {
          void loadLegacyModules();
        }
      });
    });

    return () => {
      cancelledRef.cancelled = true;
    };
  }, []);

  return React.createElement(React.Fragment, null, parse(markup));
}
