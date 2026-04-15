import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  keywords: string[];
  image?: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((filename) => {
      const slug = filename.replace(".md", "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "BizPlan Genius",
        keywords: data.keywords || [],
        image: data.image || undefined,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    author: data.author || "BizPlan Genius",
    keywords: data.keywords || [],
    image: data.image || undefined,
    content,
  };
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts();
  const current = allPosts.find(p => p.slug === currentSlug);
  if (!current) return allPosts.slice(0, limit);

  const currentKeywords = new Set(current.keywords.map(k => k.toLowerCase()));

  // Score each post by keyword overlap
  const scored = allPosts
    .filter(p => p.slug !== currentSlug)
    .map(post => {
      const postKeywords = post.keywords.map(k => k.toLowerCase());
      const overlap = postKeywords.filter(k => currentKeywords.has(k)).length;
      // Bonus for industry-specific posts linking to each other
      const isIndustryPlan = post.slug.includes('business-plan') && current.slug.includes('business-plan');
      const isCompetitorContent = (post.keywords.some(k => k.toLowerCase().includes('competitor')) &&
        current.keywords.some(k => k.toLowerCase().includes('competitor')));
      return {
        post,
        score: overlap + (isIndustryPlan ? 1 : 0) + (isCompetitorContent ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.post);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}
