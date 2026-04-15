import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { currentHtml, editInstruction, editType } = await req.json();

    if (!currentHtml || !editInstruction) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let prompt: string;

    if (editType === 'full_regenerate') {
      prompt = `You are an expert web developer. You have an existing website HTML. The user wants changes applied to the ENTIRE website.

CURRENT WEBSITE HTML:
${currentHtml.substring(0, 15000)}

USER'S REQUESTED CHANGES:
${editInstruction}

Apply the requested changes to the website. Return the COMPLETE updated HTML document from <!DOCTYPE html> to </html>.

RULES:
- Keep all existing sections that weren't mentioned
- Apply the changes as specifically as possible
- Maintain the same design style and color scheme unless asked to change
- Return ONLY the complete HTML, no markdown or explanation`;
    } else {
      prompt = `You are an expert web developer. You have an existing website HTML. The user wants to edit a specific part.

CURRENT WEBSITE HTML:
${currentHtml.substring(0, 15000)}

EDIT TYPE: ${editType}
USER'S INSTRUCTIONS: ${editInstruction}

Apply ONLY the requested edit. Keep everything else exactly the same. Return the COMPLETE updated HTML document from <!DOCTYPE html> to </html>.

RULES:
- Only change what the user asked for
- Keep all other sections, styles, and content identical
- Maintain the same design system
- Return ONLY the complete HTML, no markdown or explanation`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let html = response.text || '';
    html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();

    if (!html.toLowerCase().startsWith('<!doctype')) {
      const idx = html.toLowerCase().indexOf('<!doctype');
      if (idx > -1) html = html.substring(idx);
    }

    return NextResponse.json({ html });
  } catch (error: any) {
    console.error('Edit website error:', error);
    return NextResponse.json({ error: 'Failed to apply edit' }, { status: 500 });
  }
}
