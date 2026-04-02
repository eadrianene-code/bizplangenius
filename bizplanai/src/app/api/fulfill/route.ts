import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const maxDuration = 60;

function buildPrompt(meta: Record<string, string>): string {
  return `You are a world-class business strategy consultant who creates comprehensive, investor-ready business plans. Generate a complete business plan for the following business.

BUSINESS DETAILS:
- Business Name: ${meta.businessName}
- Industry: ${meta.industry}
- Description: ${meta.description}
- Target Market: ${meta.targetMarket}
- Revenue Model: ${meta.revenueModel}
- Location: ${meta.location || 'Not specified'}
- Starting Budget: ${meta.investment || 'Not specified'}
- Known Competitors: ${meta.competitors || 'None listed — research and identify the top competitors'}

INSTRUCTIONS:
Create a thorough, professional business plan with the following sections. Use REAL industry data, realistic estimates, and specific numbers wherever possible. Do NOT use placeholder text or generic filler.

Generate the plan in this exact JSON structure:

{
  "executiveSummary": {
    "overview": "2-3 paragraph company overview",
    "mission": "Mission statement",
    "vision": "Vision statement",
    "valueProposition": "Clear unique value proposition",
