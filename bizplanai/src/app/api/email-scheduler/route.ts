import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  sendEmail,
  abandonedCheckoutEmail,
  abandonedCheckoutEmail2,
  abandonedCheckoutEmail3,
  welcomeEmail1,
  welcomeEmail2,
  welcomeEmail3,
} from '@/lib/emails';

// Use /tmp on Vercel (serverless filesystem is read-only except /tmp)
const DATA_DIR = path.join('/tmp', 'bizplan-email-data');
const QUEUE_FILE = path.join(DATA_DIR, 'email-queue.json');

interface QueuedEmail {
  email: string;
  type: 'abandoned_checkout' | 'abandoned_checkout_2' | 'abandoned_checkout_3' | 'welcome_1' | 'welcome_2' | 'welcome_3';
  businessName?: string;
  scheduledAt: string;
  createdAt: string;
  sent: boolean;
}

function loadQueue(): QueuedEmail[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(QUEUE_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8')); } catch { return []; }
}

function saveQueue(queue: QueuedEmail[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// GET handler for Vercel Cron (processes queue every 15 min)
export async function GET(req: NextRequest) {
  // Verify cron secret if set
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const queue = loadQueue();
  const now = new Date();
  let sent = 0;

  for (const item of queue) {
    if (item.sent) continue;
    if (new Date(item.scheduledAt) > now) continue;

    let emailContent;
    switch (item.type) {
      case 'abandoned_checkout': emailContent = abandonedCheckoutEmail(item.businessName || 'your'); break;
      case 'abandoned_checkout_2': emailContent = abandonedCheckoutEmail2(item.businessName || 'your'); break;
      case 'abandoned_checkout_3': emailContent = abandonedCheckoutEmail3(item.businessName || 'your'); break;
      case 'welcome_1': emailContent = welcomeEmail1(); break;
      case 'welcome_2': emailContent = welcomeEmail2(); break;
      case 'welcome_3': emailContent = welcomeEmail3(); break;
    }

    if (emailContent) {
      await sendEmail(item.email, emailContent.subject, emailContent.html);
      item.sent = true;
      sent++;
    }
  }

  // Clean up old sent emails (keep last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const cleaned = queue.filter(q => !q.sent || new Date(q.createdAt) > weekAgo);
  saveQueue(cleaned);

  return NextResponse.json({ ok: true, processed: sent, pending: cleaned.filter(q => !q.sent).length });
}

export async function POST(req: NextRequest) {
  try {
    const { action, email, businessName, source } = await req.json();

    if (action === 'schedule_abandoned') {
      // Schedule 3-email abandoned checkout sequence: 1h, 24h, 72h
      if (!email || !businessName) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

      const queue = loadQueue();
      // Don't duplicate the sequence (check email 1 of 3)
      if (queue.some(q => q.email === email.toLowerCase() && q.type === 'abandoned_checkout' && !q.sent)) {
        return NextResponse.json({ ok: true, msg: 'Already queued' });
      }

      const now = Date.now();
      const createdAt = new Date().toISOString();
      queue.push(
        { email: email.toLowerCase(), type: 'abandoned_checkout',   businessName, scheduledAt: new Date(now + 1 * 60 * 60 * 1000).toISOString(),  createdAt, sent: false },
        { email: email.toLowerCase(), type: 'abandoned_checkout_2', businessName, scheduledAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(), createdAt, sent: false },
        { email: email.toLowerCase(), type: 'abandoned_checkout_3', businessName, scheduledAt: new Date(now + 72 * 60 * 60 * 1000).toISOString(), createdAt, sent: false },
      );
      saveQueue(queue);
      return NextResponse.json({ ok: true, scheduled: 3 });
    }

    if (action === 'cancel_abandoned') {
      // Customer completed checkout: cancel any pending abandoned-cart emails for this email
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
      const queue = loadQueue();
      let cancelled = 0;
      const target = email.toLowerCase();
      for (const item of queue) {
        if (
          item.email === target &&
          !item.sent &&
          (item.type === 'abandoned_checkout' || item.type === 'abandoned_checkout_2' || item.type === 'abandoned_checkout_3')
        ) {
          item.sent = true; // Mark as sent so it never fires
          cancelled++;
        }
      }
      saveQueue(queue);
      return NextResponse.json({ ok: true, cancelled });
    }

    if (action === 'schedule_welcome') {
      // Schedule 3-email welcome sequence
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

      const queue = loadQueue();
      // Don't duplicate
      if (queue.some(q => q.email === email.toLowerCase() && q.type === 'welcome_1')) {
        return NextResponse.json({ ok: true, msg: 'Already queued' });
      }

      const now = Date.now();
      // Email 1: immediately, Email 2: 3 days, Email 3: 7 days
      queue.push(
        { email: email.toLowerCase(), type: 'welcome_1', scheduledAt: new Date(now + 5 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), sent: false },
        { email: email.toLowerCase(), type: 'welcome_2', scheduledAt: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), sent: false },
        { email: email.toLowerCase(), type: 'welcome_3', scheduledAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), sent: false },
      );
      saveQueue(queue);
      return NextResponse.json({ ok: true });
    }

    if (action === 'process') {
      // Process queued emails that are due (call this via Vercel Cron)
      const queue = loadQueue();
      const now = new Date();
      let sent = 0;

      for (const item of queue) {
        if (item.sent) continue;
        if (new Date(item.scheduledAt) > now) continue;

        let emailContent;
        switch (item.type) {
          case 'abandoned_checkout':
            emailContent = abandonedCheckoutEmail(item.businessName || 'your');
            break;
          case 'abandoned_checkout_2':
            emailContent = abandonedCheckoutEmail2(item.businessName || 'your');
            break;
          case 'abandoned_checkout_3':
            emailContent = abandonedCheckoutEmail3(item.businessName || 'your');
            break;
          case 'welcome_1':
            emailContent = welcomeEmail1();
            break;
          case 'welcome_2':
            emailContent = welcomeEmail2();
            break;
          case 'welcome_3':
            emailContent = welcomeEmail3();
            break;
        }

        if (emailContent) {
          await sendEmail(item.email, emailContent.subject, emailContent.html);
          item.sent = true;
          sent++;
        }
      }

      saveQueue(queue);
      return NextResponse.json({ ok: true, processed: sent });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Email scheduler error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
