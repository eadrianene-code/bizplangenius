# PlanGenie AI — Deployment Guide

## What You Need (All Free)

1. **GitHub account** — github.com (free)
2. **Vercel account** — vercel.com (sign up with GitHub — free)
3. **Google Gemini API key** — aistudio.google.com/apikey (free, no credit card)
4. **Your Stripe keys** — dashboard.stripe.com/apikeys (you already have this)
5. **A domain** — porkbun.com (~$9-10)

## Step-by-Step Deployment

### Step 1: Create GitHub Repository
1. Go to github.com and sign in (or create account)
2. Click the green "New" button (top left)
3. Name it `bizplanai`
4. Keep it **Private**
5. Click "Create repository"
6. Upload ALL the files from this folder to the repository

### Step 2: Get Your Gemini API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key — you'll need it in Step 4

### Step 3: Connect to Vercel
1. Go to vercel.com and sign in with GitHub
2. Click "Import Project"
3. Select your `bizplanai` repository
4. Framework: Next.js (should auto-detect)

### Step 4: Add Environment Variables
In Vercel's project settings, add these environment variables:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | Your Gemini API key from Step 2 |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (starts with sk_live_) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (starts with pk_live_) |
| `NEXT_PUBLIC_BASE_URL` | https://yourdomain.com |

### Step 5: Deploy
1. Click "Deploy" in Vercel
2. Wait 1-2 minutes for it to build
3. Your site will be live at yourproject.vercel.app

### Step 6: Connect Your Domain
1. In Vercel, go to Project Settings → Domains
2. Add your custom domain (e.g., plangenie.ai)
3. Update your domain's DNS at Porkbun to point to Vercel (Vercel will show you exactly what to add)

### Step 7: Get Your Stripe Keys
1. Go to dashboard.stripe.com
2. Click Developers → API Keys
3. Copy the "Publishable key" and "Secret key"
4. Add them to Vercel environment variables

## You're Live!

Your site should now be accepting payments and generating business plans.

## Need Help?

If anything goes wrong during deployment, share the error message and I'll fix it.
