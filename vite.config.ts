import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize the environment variable, but fallback to the provided key if missing
  const apiKey = env.API_KEY || "AIzaSyBkx6KKAqyuzz7DNkPtH2haOF-ztjkCy0A";
  
  return {
    plugins: [react()],
    define: {
      // This allows process.env.API_KEY to work in the browser code
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 3000
    }
  };
});