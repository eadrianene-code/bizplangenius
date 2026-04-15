import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { remark } from "remark";
import html from "remark-html";
import NewsletterSignup from "../../components/NewsletterSignup";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} - BizPlan Genius`,
    description: post.description,
    keywords: post.keywords.join(", "),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `https://www.bizplangenius.com/blog/${slug}`,
      siteName: "BizPlan Genius",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);
  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            BizPlan Genius
          </Link>
          <nav className="flex gap-6 items-center">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Blog
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Your Plan - From $29
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-gray-600">
            Blog
          </Link>{" "}
          / <span className="text-gray-600">{post.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <span>By {post.author}</span>
          <span>|</span>
          <time>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {post.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-li:text-gray-700
            prose-strong:text-gray-900
            prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Context-aware CTAs based on post topic */}
        {(() => {
          const kw = post.keywords.map(k => k.toLowerCase()).join(' ');
          const isCompetitor = kw.includes('competitor') || kw.includes('competitive') || kw.includes('swot');
          const isFundraising = kw.includes('investor') || kw.includes('pitch') || kw.includes('funding') || kw.includes('raise');
          const isMarketing = kw.includes('marketing') || kw.includes('social media') || kw.includes('brand');
          const isCost = kw.includes('cost') || kw.includes('startup cost') || kw.includes('budget');

          return (
            <>
              {/* Primary CTA */}
              {isCompetitor ? (
                <div className="mt-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
                  <h2 className="text-2xl font-bold mb-3">Spy on your competitors for $19</h2>
                  <p className="text-orange-100 mb-6 max-w-lg mx-auto">Get 10-15 real competitors analyzed with pricing, SWOT, vulnerability audit, and a 90-day plan to beat them.</p>
                  <Link href="/spy" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">Run Your Competitor Spy Report</Link>
                </div>
              ) : (
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
                  <h2 className="text-2xl font-bold mb-3">Ready to create your business plan?</h2>
                  <p className="text-blue-100 mb-6 max-w-lg mx-auto">BizPlan Genius researches real competitors and market data for your specific business. Plans from $29.</p>
                  <Link href="/#pricing" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">Get Your Plan - From $29</Link>
                </div>
              )}

              {/* Secondary contextual CTAs */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {isFundraising && (
                  <>
                    <Link href="/pitch-deck" className="p-3 rounded-xl border border-purple-200 bg-purple-50 hover:border-purple-400 transition text-center">
                      <p className="font-bold text-gray-900 text-sm">Pitch Deck</p>
                      <p className="text-xs text-purple-600 font-bold">$39</p>
                    </Link>
                    <Link href="/investor-emails" className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:border-indigo-400 transition text-center">
                      <p className="font-bold text-gray-900 text-sm">Investor Emails</p>
                      <p className="text-xs text-indigo-600 font-bold">$19</p>
                    </Link>
                  </>
                )}
                {isMarketing && (
                  <>
                    <Link href="/social-pack" className="p-3 rounded-xl border border-pink-200 bg-pink-50 hover:border-pink-400 transition text-center">
                      <p className="font-bold text-gray-900 text-sm">Social Pack</p>
                      <p className="text-xs text-pink-600 font-bold">$29</p>
                    </Link>
                    <Link href="/brand-kit" className="p-3 rounded-xl border border-orange-200 bg-orange-50 hover:border-orange-400 transition text-center">
                      <p className="font-bold text-gray-900 text-sm">Brand Kit</p>
                      <p className="text-xs text-orange-600 font-bold">$29</p>
                    </Link>
                  </>
                )}
                {isCost && (
                  <Link href="/startup-cost-calculator" className="p-3 rounded-xl border border-green-200 bg-green-50 hover:border-green-400 transition text-center">
                    <p className="font-bold text-gray-900 text-sm">Cost Calculator</p>
                    <p className="text-xs text-green-600 font-bold">Free</p>
                  </Link>
                )}
                {!isFundraising && !isMarketing && (
                  <>
                    <Link href="/build-website" className="p-3 rounded-xl border border-accent-200 bg-accent-50 hover:border-accent-400 transition text-center">
                      <p className="font-bold text-gray-900 text-sm">Website</p>
                      <p className="text-xs text-accent-600 font-bold">$99</p>
                    </Link>
                    <Link href="/brand-kit" className="p-3 rounded-xl border border-orange-200 bg-orange-50 hover:border-orange-400 transition text-center">
                      <p className="font-bold text-gray-900 text-sm">Brand Kit</p>
                      <p className="text-xs text-orange-600 font-bold">$29</p>
                    </Link>
                  </>
                )}
                <Link href="/bundles" className="p-3 rounded-xl border border-brand-200 bg-brand-50 hover:border-brand-400 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Bundles</p>
                  <p className="text-xs text-brand-600 font-bold">From $59</p>
                </Link>
                {!isCompetitor && (
                  <Link href="/free-competitor-check" className="p-3 rounded-xl border border-green-200 bg-green-50 hover:border-green-400 transition text-center">
                    <p className="font-bold text-gray-900 text-sm">Competitor Check</p>
                    <p className="text-xs text-green-600 font-bold">Free</p>
                  </Link>
                )}
              </div>
            </>
          );
        })()}
      </article>

      {/* Newsletter */}
      <div className="max-w-2xl mx-auto mt-12">
        <NewsletterSignup />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group block border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                  {rp.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">{rp.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Free Tool CTA */}
      <div className="max-w-3xl mx-auto mb-12 p-6 bg-gray-50 rounded-xl border text-center">
        <p className="font-bold text-gray-900 mb-1">Free: Find your top 3 competitors in 30 seconds</p>
        <p className="text-sm text-gray-500 mb-3">Try our AI-powered competitor check. No payment required.</p>
        <Link href="/free-competitor-check" className="inline-block px-6 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition">
          Free Competitor Check
        </Link>
      </div>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: post.author,
              url: "https://www.bizplangenius.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "BizPlan Genius",
              url: "https://www.bizplangenius.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.bizplangenius.com/blog/${slug}`,
            },
          }),
        }}
      />
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bizplangenius.com" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.bizplangenius.com/blog" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.bizplangenius.com/blog/${slug}` },
            ],
          }),
        }}
      />
    </div>
  );
}
