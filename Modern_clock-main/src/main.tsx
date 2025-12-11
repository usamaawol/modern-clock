import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Register PWA service worker (vite-plugin-pwa)
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
	onNeedRefresh() {
		// custom event for app to show update available
		window.dispatchEvent(new CustomEvent("sw-update-available"));
	},
	onOfflineReady() {
		window.dispatchEvent(new CustomEvent("sw-offline-ready"));
	}
});

// Capture beforeinstallprompt for custom install UI
window.addEventListener("beforeinstallprompt", (e: Event) => {
	e.preventDefault();
	// store the event for later
	// @ts-ignore
	window.__deferredPWAInstall = e;
	window.dispatchEvent(new CustomEvent("pwa-install-available"));
});

createRoot(document.getElementById("root")!).render(<App />);
