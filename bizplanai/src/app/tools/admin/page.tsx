'use client';

import { useState } from 'react';

interface EmailEntry {
  email: string;
  source: string;
  timestamp: string;
}

interface Sale {
  email: string;
  amount: number;
  product: string;
  tier: string;
  date: string;
  businessName: string;
}

interface Stats {
  emails: {
    total: number;
    recent30d: number;
    list: EmailEntry[];
    sourceBreakdown: Record<string, number>;
  };
  sales: {
    total: number;
    totalRevenue: number;
    list: Sale[];
  };
}

export default function AdminPage() {
  const [authKey, setAuthKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'overview' | 'emails' | 'sales'>('overview');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    loadStats(authKey);
  };

  const loadStats = async (key: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tools-key': key },
      });
      if (res.status === 401) { setAuthenticated(false); setError('Invalid key'); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your access key.</p>
          <input type="password" required value={authKey} onChange={e => setAuthKey(e.target.value)}
            placeholder="Access key" className="w-full px-4 py-3 border rounded-lg outline-none mb-4" />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">Enter</button>
        </form>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <div className="flex items-center gap-4">
            <a href="/tools/social" className="text-sm text-gray-500 hover:text-gray-700">Social Tool</a>
            <span className="text-sm text-gray-500 font-medium">Admin</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Emails" value={stats.emails.total} />
          <StatCard label="Emails (30d)" value={stats.emails.recent30d} />
          <StatCard label="Total Sales" value={stats.sales.total} />
          <StatCard label="Total Revenue" value={`$${stats.sales.totalRevenue.toFixed(0)}`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {(['overview', 'emails', 'sales'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Sources */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-gray-900 mb-4">Email Sources</h3>
              <div className="space-y-2">
                {Object.entries(stats.emails.sourceBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate">{source}</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Sales</h3>
              {stats.sales.list.length === 0 ? (
                <p className="text-sm text-gray-500">No sales yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats.sales.list.slice(0, 5).map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.businessName}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">${s.amount}</p>
                        <p className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emails Tab */}
        {tab === 'emails' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.emails.list.map((e, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-900">{e.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{e.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(e.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.emails.list.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-500">No emails collected yet.</p>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {tab === 'sales' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Business</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.sales.list.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-900">{s.businessName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{s.product.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">${s.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(s.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.sales.list.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-500">No sales yet. Keep pushing!</p>
            )}
          </div>
        )}

        {/* Refresh */}
        <div className="text-center mt-8">
          <button onClick={() => loadStats(authKey)} className="text-sm text-brand-600 hover:text-brand-700 underline">
            Refresh data
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
