import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Store email in a simple JSON file (upgrade to a database later)
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'collected-emails.json');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing emails
    let emails: Array<{ email: string; source: string; timestamp: string }> = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      emails = JSON.parse(raw);
    }

    // Check for duplicates
    const exists = emails.some(e => e.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      emails.push({
        email: email.toLowerCase().trim(),
        source: source || 'unknown',
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email collection error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
