import { getSupabaseAdmin, type CounselOrderRow } from '@/lib/supabase-admin';

// Force fresh data on every load
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900',
  cleared: 'bg-green-100 text-green-900',
  refunded: 'bg-red-100 text-red-900',
  intake_received: 'bg-slate-100 text-slate-900',
  in_production: 'bg-blue-100 text-blue-900',
  delivered: 'bg-green-100 text-green-900',
  awaiting_balance: 'bg-purple-100 text-purple-900',
  closed: 'bg-slate-200 text-slate-700',
  not_yet: 'bg-slate-100 text-slate-700',
  invoiced: 'bg-amber-100 text-amber-900',
  paid: 'bg-green-100 text-green-900',
};

function badge(text: string) {
  const cls = STATUS_COLORS[text] || 'bg-slate-100 text-slate-900';
  return `<span class="${cls}">${text}</span>`;
}

function daysFromNow(dateStr?: string): string {
  if (!dateStr) return '-';
  const ms = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(ms / 86400000);
  if (days < 0) return `${Math.abs(days)}d OVERDUE`;
  if (days === 0) return 'TODAY';
  return `${days}d left`;
}

function fmtUsd(n: number | undefined): string {
  if (n === undefined || n === null) return '-';
  return `$${n.toLocaleString()}`;
}

function fmtDate(s?: string): string {
  if (!s) return '-';
  return new Date(s).toISOString().slice(0, 16).replace('T', ' ');
}

export default async function CounselOrdersAdminPage() {
  let orders: CounselOrderRow[] = [];
  let fetchError: string | null = null;

  try {
    const supa = getSupabaseAdmin();
    const { data, error } = await supa
      .from('counsel_orders')
      .select('*')
      .order('production_deadline', { ascending: true, nullsFirst: false });
    if (error) throw error;
    orders = (data || []) as CounselOrderRow[];
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error';
  }

  // Status counts
  const counts: Record<string, number> = {};
  for (const o of orders) {
    counts[o.plan_status || 'unknown'] = (counts[o.plan_status || 'unknown'] || 0) + 1;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Counsel Orders</h1>
            <p className="mt-1 text-sm text-slate-600">
              All B2B engagements. Sorted by production deadline ascending.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            {orders.length} order{orders.length === 1 ? '' : 's'} total
          </div>
        </header>

        {fetchError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <strong>Failed to load orders:</strong> {fetchError}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          {Object.entries(counts).map(([status, n]) => (
            <span key={status} className={`rounded px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status] || 'bg-slate-200 text-slate-900'}`}>
              {status}: {n}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-3 py-3 text-left">Order ID</th>
                <th className="px-3 py-3 text-left">Firm</th>
                <th className="px-3 py-3 text-left">Investor</th>
                <th className="px-3 py-3 text-left">Visa</th>
                <th className="px-3 py-3 text-right">Fee</th>
                <th className="px-3 py-3 text-center">Deposit</th>
                <th className="px-3 py-3 text-center">Plan</th>
                <th className="px-3 py-3 text-center">Balance</th>
                <th className="px-3 py-3 text-left">Deadline</th>
                <th className="px-3 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 && !fetchError && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-sm text-slate-500">
                    No orders yet. Once a lawyer submits at /counsel/intake, the order appears here.
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.order_id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 font-mono text-xs">{o.order_id}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{o.firm_name}</div>
                    <div className="text-xs text-slate-500">{o.attorney_name}</div>
                    <a href={`mailto:${o.firm_email}`} className="text-xs text-blue-700 hover:underline">{o.firm_email}</a>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{o.investor_name}</div>
                    <div className="text-xs text-slate-500">{o.investor_country}</div>
                  </td>
                  <td className="px-3 py-3 font-semibold">{o.visa_category}</td>
                  <td className="px-3 py-3 text-right font-mono">
                    <div>{fmtUsd(o.total_price)}</div>
                    <div className="text-xs text-slate-500">dep {fmtUsd(o.deposit_price)}</div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${STATUS_COLORS[o.deposit_status || ''] || 'bg-slate-100'}`}>
                      {o.deposit_status || 'pending'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${STATUS_COLORS[o.plan_status || ''] || 'bg-slate-100'}`}>
                      {o.plan_status || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${STATUS_COLORS[o.balance_status || ''] || 'bg-slate-100'}`}>
                      {o.balance_status || 'not_yet'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-xs">{o.production_deadline || '-'}</div>
                    <div className="text-xs font-semibold text-slate-600">{daysFromNow(o.production_deadline)}</div>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">{fmtDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Data source: Supabase counsel_orders table. Production deadlines are
          set when deposit clears via Stripe webhook.
        </p>
      </div>
    </main>
  );
}
