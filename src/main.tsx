import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function enableMocking() {
  const { worker } = await import('./lib/msw/browser');
  return worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
  });
}

createRoot(document.getElementById('root')!).render(<App />);

// Start MSW in the background; don't block initial render
enableMocking().catch((err) => {
  console.warn('MSW failed to start, continuing without mocks.', err);
});
