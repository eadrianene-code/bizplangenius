import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'affiliates.json');

interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  commissionRate: number; // percentage
  clicks: number;
  conversions: number;
  totalEarned: number;
  payouts: number;
  createdAt: string;
  status: 'active' | 'pending' | 'disabled';
}

function loadAffiliates(): Affiliate[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
}

function saveAffiliates(affiliates: Affiliate[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(affiliates, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { action, ...body } = await req.json();
    const affiliates = loadAffiliates();

    if (action === 'apply') {
      const { name, email, website, audience, howPromote } = body;
      if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });

      const exists = affiliates.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (exists) return NextResponse.json({ error: 'Email already registered', affiliate: exists });

      const code = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) + Math.random().toString(36).substring(2, 6);
      const affiliate: Affiliate = {
        id: Date.now().toString(36),
        name,
        email: email.toLowerCase(),
        code,
        commissionRate: 20,
        clicks: 0,
        conversions: 0,
        totalEarned: 0,
        payouts: 0,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      affiliates.push(affiliate);
      saveAffiliates(affiliates);

      // Also save email to collected emails
      const emailsPath = path.join(DATA_DIR, 'collected-emails.json');
      let emails: any[] = [];
      if (fs.existsSync(emailsPath)) emails = JSON.parse(fs.readFileSync(emailsPath, 'utf-8'));
      if (!emails.some(e => e.email === email.toLowerCase())) {
        emails.push({ email: email.toLowerCase(), source: `affiliate_signup_${code}`, timestamp: new Date().toISOString() });
        fs.writeFileSync(emailsPath, JSON.stringify(emails, null, 2));
      }

      return NextResponse.json({ affiliate });
    }

    if (action === 'dashboard') {
      const { email } = body;
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
      const affiliate = affiliates.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (!affiliate) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ affiliate });
    }

    if (action === 'track_click') {
      const { code } = body;
      const affiliate = affiliates.find(a => a.code === code);
      if (affiliate) {
        affiliate.clicks++;
        saveAffiliates(affiliates);
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Affiliate error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
