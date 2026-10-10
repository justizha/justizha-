// Every .md file in ./markdown becomes a post. The filename is the URL slug:
// Cat.md -> /blog/cat. Optional frontmatter at the top of the file:
//
// ---
// title: Cat.
// date: 2025-07-12
// summary: One line shown on the blog list.
// ---

export type BlogPost = {
  slug: string;
  title: string;
  date?: string;
  summary?: string;
  body: string;
  minutes: number;
};

const files = import.meta.glob('./markdown/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string) {
  const text = raw.replace(/^\uFEFF/, '');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta: Record<string, string> = {};

  if (!match) return { meta, body: text };

  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line
      .slice(colon + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    meta[key] = value;
  }

  return { meta, body: text.slice(match[0].length) };
}

function humanize(slug: string) {
  const text = slug.replace(/[-_]+/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toPost(path: string, raw: string): BlogPost {
  const fileName = path.split('/').pop() ?? path;
  const slug = fileName.replace(/\.md$/, '').toLowerCase();

  const { meta, body: withHeading } = parseFrontmatter(raw);

  // The page renders the title itself, so a leading "# Heading" would show twice
  const h1 = withHeading.match(/^\s*#\s+(.+?)\s*(?:\r?\n|$)/);
  const body = h1 ? withHeading.slice(h1[0].length) : withHeading;

  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: meta.title || h1?.[1] || humanize(slug),
    date: meta.date || undefined,
    summary: meta.summary || undefined,
    body,
    minutes: Math.max(1, Math.round(words / 200)),
  };
}

// Newest first; posts without a date go last
export const posts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => toPost(path, raw))
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug.toLowerCase());
}
