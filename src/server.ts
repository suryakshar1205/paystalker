import http from 'http';
import fs from 'fs';
import path from 'path';
import { activeInvoices } from './index.js';
import { 
  getDecayingDiscount, 
  translateWhatsAppToDiscordBug, 
  generateExecutiveResolutionEmail 
} from './aiService.js';
import { Invoice } from './types.js';

const PORT = process.env.PORT || 3000;

export function startDashboardServer() {
  const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = req.url || '/';

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Serve static dashboard UI (public/index.html)
    if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
      const htmlPath = path.join(process.cwd(), 'public', 'index.html');
      fs.readFile(htmlPath, 'utf8', (err: any, data: string) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error loading dashboard UI');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }

    // API: Trigger Invoice Collect
    if (req.method === 'POST' && url === '/api/collect') {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const command = payload.command || '!collect 1500 client@acmecorp.com Mobile Checkout Redesign';
          
          const parts = command.split(' ');
          const amount = parseFloat(parts[1] || '1500');
          const clientEmail = parts[2] || 'client@acmecorp.com';
          const description = parts.slice(3).join(' ') || 'Mobile Checkout Redesign';
          
          const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
          const createdAt = new Date();

          const invoice: Invoice = {
            id: invId,
            amount,
            currentDiscountPercent: 10,
            clientEmail,
            clientPhone: 'whatsapp:+14155552671',
            description,
            status: 'PENDING',
            createdAt
          };

          activeInvoices.set(invId, invoice);

          const decay = getDecayingDiscount(createdAt, amount);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            invId,
            amount,
            clientEmail,
            discountedAmount: decay.discountedAmount,
            discountPercent: decay.currentPercent
          }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid payload' }));
        }
      });
      return;
    }

    // API: Trigger Client WhatsApp Dispute
    if (req.method === 'POST' && url === '/api/dispute') {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const message = payload.message || 'The checkout button crashes on iOS Safari when tapping pay!';
          
          const activeList = Array.from(activeInvoices.values());
          const targetInvoice = activeList[activeList.length - 1];
          const invId = targetInvoice ? targetInvoice.id : 'INV-8842';

          if (targetInvoice) {
            targetInvoice.status = 'DISPUTED_BUG';
          }

          const bugReport = await translateWhatsAppToDiscordBug(message);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            invId,
            bugReport
          }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid payload' }));
        }
      });
      return;
    }

    // API: Trigger Freelancer Discord Proof Resolution
    if (req.method === 'POST' && url === '/api/resolve') {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const proofUrl = payload.proofUrl || 'https://github.com/acme/checkout-repo/pull/42';
          
          const activeList = Array.from(activeInvoices.values());
          const targetInvoice = activeList[activeList.length - 1];
          const invId = targetInvoice ? targetInvoice.id : 'INV-8842';

          if (targetInvoice) {
            targetInvoice.status = 'PAID';
          }

          const resolutionEmail = await generateExecutiveResolutionEmail(invId, proofUrl);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            invId,
            clientEmail: targetInvoice ? targetInvoice.clientEmail : 'client@acmecorp.com',
            resolutionEmail
          }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid payload' }));
        }
      });
      return;
    }

    // 404 Fallback
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log(`🌐 PayStalker Web Dashboard active at http://localhost:${PORT}`);
  });
}

// Start server if run directly
if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startDashboardServer();
}
