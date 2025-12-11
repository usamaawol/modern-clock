import React, { useEffect, useState } from "react";

const InstallPrompt: React.FC = () => {
  const [available, setAvailable] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onAvailable = () => setAvailable(true);
    window.addEventListener("pwa-install-available", onAvailable as EventListener);
    return () => window.removeEventListener("pwa-install-available", onAvailable as EventListener);
  }, []);

  useEffect(() => {
    if (available) {
      // delay showing a little so app content stabilizes
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, [available]);

  const handleInstall = async () => {
    // @ts-ignore
    const e = window.__deferredPWAInstall;
    if (e) {
      // @ts-ignore
      await e.prompt();
      // @ts-ignore
      const choice = await e.userChoice;
      // hide prompt regardless of the choice
      setShow(false);
      setAvailable(false);
    } else {
      // fallback: open URL to install info
      window.alert("Install by using browser menu: Add to Home screen");
    }
  };

  if (!show) return null;

  return (
    <div style={{position: "fixed", right: 16, bottom: 24, zIndex: 9999}}>
      <button
        onClick={handleInstall}
        style={{
          background: "linear-gradient(90deg,#00d4ff,#0066ff)",
          color: "white",
          border: "none",
          padding: "12px 16px",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(2,6,23,0.4)",
          fontWeight: 600
        }}
        aria-label="Install WakeWise"
      >
        Install WakeWise
      </button>
    </div>
  );
};

export default InstallPrompt;
