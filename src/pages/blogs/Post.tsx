import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router";
import Nav from "../../components/Navigation";
import { getPost } from "./posts";

// The markdown renderer is the heavy part, so it only loads once a post is opened
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <main className="min-h-screen pb-3">
        <Nav />
        <div className="mx-auto max-w-2xl px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-100">Post not found</h1>
          <p className="mt-2 text-gray-400">That post doesn't exist.</p>
          <Link
            to="/blog"
            className="mt-5 inline-block text-teal-300 hover:text-teal-200 hover:underline"
          >
            All posts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <div className="mx-auto max-w-2xl px-8 py-10">
        <header className="border-b border-teal-900 pb-5">
          <h1 className="text-3xl font-bold text-gray-100">{post.title}</h1>
          <div className="mt-2 flex gap-4 text-sm text-gray-400">
            {post.date && <time dateTime={post.date}>{post.date}</time>}
            <span>{post.minutes} min read</span>
          </div>
        </header>

        <article className="prose mt-6 max-w-none">
          <Suspense
            fallback={<p className="text-sm text-gray-400">Loading post...</p>}
          >
            <MarkdownPreview
              source={post.body}
              wrapperElement={{ "data-color-mode": "dark" }}
              style={{
                backgroundColor: "transparent",
                fontFamily: "monospace",
              }}
            />
          </Suspense>
        </article>

        <footer className="mt-10 border-t border-teal-900/50 pt-5 pb-4">
          <Link
            to="/blog"
            className="text-teal-300 hover:text-teal-200 hover:underline"
          >
            ← All posts
          </Link>
        </footer>
      </div>
    </main>
  );
}