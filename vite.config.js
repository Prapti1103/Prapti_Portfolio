import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleContact } from './server/contact-core.js';

// Serves /api/contact locally during `npm run dev` using the same handler
// that runs in production (Vercel / Netlify). Reads .env (server-only vars).
function contactApiDev(env) {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        let raw = '';
        req.on('data', (c) => { raw += c; if (raw.length > 20000) req.destroy(); });
        req.on('end', async () => {
          const { status, body } = await handleContact({
            method: req.method, body: raw, ip: req.socket.remoteAddress, origin: req.headers.origin || '',
            env: { ...process.env, ...env },
          });
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // all vars, NOT exposed to client
  return {
    plugins: [react(), contactApiDev(env)],
    build: { chunkSizeWarningLimit: 700 },
  };
});
