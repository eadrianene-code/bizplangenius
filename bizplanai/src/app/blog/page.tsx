import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — BizPlan Genius | Business Planning Tips & Guides",
  description:
    "Expert guides on writing business plans, competitor analysis, market research, and financial projections. Industry-specific tips for restaurants, food trucks, SaaS, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            BizPlan Genius
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/blog" className="text-sm font-medium text-blue-600">
              Blog
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Your Plan — $49
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Business Plan Guides & Resources
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          Expert guides on writing business plans with real competitor research,
          market data, and financial projections — for every industry.
        </p>

        {posts.length === 0 ? (
          <p className="text-gray-500">Articles coming soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <time className="text-sm text-gray-400">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="text-xl font-semibold text-gray-900 mt-2 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* CTA */}
      <section className="bg-blue-50 border-t">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Skip the research. Get a real business plan in 5 minutes.
          </h2>
          <p className="text-gray-600 mb-8">
            BizPlan Genius uses AI to research real competitors, real market
            data, and real financial benchmarks for YOUR specific business.
          </p>
          <Link
            href="/#pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Generate Your Business Plan — $49
          </Link>
        </div>
      </section>
    </div>
  );
}
