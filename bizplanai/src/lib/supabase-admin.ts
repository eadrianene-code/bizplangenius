import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the service role key. Has full
 * access bypassing RLS. NEVER expose this to the client/browser.
 *
 * Used by:
 * - /api/counsel/submit-intake (insert new counsel_orders)
 * - /api/counsel/stripe-webhook (update order status on deposit clearance)
 * - /admin/counsel-orders (read all orders for dashboard)
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface CounselOrderRow {
  id?: number;
  order_id: string;
  attorney_name: string;
  firm_name: string;
  firm_email: string;
  firm_phone?: string;
  bar_admission_state: string;
  investor_name: string;
  investor_country: string;
  visa_category: string;
  investment_amount: number;
  business_concept: string;
  business_name: string;
  industry: string;
  naics_code?: string;
  us_location: string;
  us_state: string;
  source_of_funds_summary: string;
  existing_us_entity: boolean;
  us_entity_name?: string;
  us_entity_state?: string;
  hires_year1: number;
  hires_year2: number;
  hires_year3: number;
  rush_production: boolean;
  total_price: number;
  deposit_price: number;
  production_days: number;
  deposit_status?: string;
  plan_status?: string;
  balance_status?: string;
  production_deadline?: string;
  deposit_cleared_at?: string;
  delivered_at?: string;
  stripe_deposit_payment_link?: string;
  stripe_deposit_product_id?: string;
  stripe_deposit_price_id?: string;
  signature_name: string;
  signer_ip?: string;
  user_agent?: string;
  submitted_at: string;
  compliance_notes?: string;
  internal_notes?: string;
  intake_json: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}
