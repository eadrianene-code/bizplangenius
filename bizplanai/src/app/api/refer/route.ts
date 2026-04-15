import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'referrals.json');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let referrals: Array<{
      referrerEmail: string;
      referralCode: string;
      clicks: number;
      signups: string[];
      createdAt: string;
    }> = [];

    if (fs.existsSync(filePath)) {
      referrals = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    if (action === 'create') {
      // Generate or get existing referral code
      const existing = referrals.find(r => r.referrerEmail.toLowerCase() === email.toLowerCase());
      if (existing) {
        return NextResponse.json({ code: existing.referralCode, clicks: existing.clicks, signups: existing.signups.length });
      }

      const code = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substring(2, 6);
      referrals.push({
        referrerEmail: email.toLowerCase(),
        referralCode: code,
        clicks: 0,
        signups: [],
        createdAt: new Date().toISOString(),
      });
      fs.writeFileSync(filePath, JSON.stringify(referrals, null, 2));
      return NextResponse.json({ code, clicks: 0, signups: 0 });
    }

    if (action === 'track_click') {
      const { code } = await req.json().catch(() => ({ code: '' }));
      const ref = referrals.find(r => r.referralCode === code);
      if (ref) {
        ref.clicks++;
        fs.writeFileSync(filePath, JSON.stringify(referrals, null, 2));
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'stats') {
      const ref = referrals.find(r => r.referrerEmail.toLowerCase() === email.toLowerCase());
      if (!ref) return NextResponse.json({ code: null, clicks: 0, signups: 0 });
      return NextResponse.json({ code: ref.referralCode, clicks: ref.clicks, signups: ref.signups.length });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Referral error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
