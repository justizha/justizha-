import { Link } from "react-router";
import Nav from "../components/Navigation";
import { posts } from "./blogs/posts";

export default function Blogs() {
  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-2xl px-8 py-8">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 text-center text-2xl">Blog Posts.</h1>
          <img
            loading="lazy"
            src="/assets/cat_typing.gif"
            className="w-36"
            alt="me fr"
          />
        </div>

        {posts.length === 0 ? (
          <p className="mt-8 text-center text-gray-400">No posts yet.</p>
        ) : (
          <ul className="mt-8 border border-teal-900">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="border-b border-teal-900/50 last:border-b-0"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-base-300/30 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current sm:flex-row sm:gap-6"
                >
                  <span className="w-24 shrink-0 pt-1 text-sm text-gray-400 tabular-nums">
                    {post.date && <time dateTime={post.date}>{post.date}</time>}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-medium text-gray-100 transition-colors group-hover:text-teal-300">
                      {post.title}
                    </span>
                    {post.summary && (
                      <span className="mt-1 block text-sm text-gray-300">
                        {post.summary}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}