import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'registrations_store.json');

function readRegistrations(): unknown[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // Ignore read error
  }
  return [];
}

function writeRegistrations(items: unknown[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch {
    // Ignore write error
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large base64 payment receipt images
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/registrations', (_req, res) => {
    const items = readRegistrations();
    res.json({ registrations: items });
  });

  app.post('/api/registrations', (req, res) => {
    const newReg = req.body;
    if (!newReg || !newReg.id) {
      res.status(400).json({ error: 'Data pendaftaran tidak valid' });
      return;
    }
    const items = readRegistrations() as Array<{ id: string }>;
    const updated = [newReg, ...items.filter((i) => i.id !== newReg.id)];
    writeRegistrations(updated);
    res.json({ success: true, registration: newReg });
  });

  app.patch('/api/registrations/:id/verify', (req, res) => {
    const { id } = req.params;
    const items = readRegistrations() as Array<{
      id: string;
      statusVerifikasi?: string;
    }>;
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            statusVerifikasi:
              item.statusVerifikasi === 'Terverifikasi'
                ? 'Menunggu Verifikasi'
                : 'Terverifikasi',
          }
        : item
    );
    writeRegistrations(updated);
    res.json({ success: true, registrations: updated });
  });

  app.delete('/api/registrations/:id', (req, res) => {
    const { id } = req.params;
    const items = readRegistrations() as Array<{ id: string }>;
    const updated = items.filter((item) => item.id !== id);
    writeRegistrations(updated);
    res.json({ success: true, registrations: updated });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
