import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function MarkdownBody({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        img: ({ node: _node, ...props }) => (
          <img
            {...props}
            loading="lazy"
            decoding="async"
            className="mx-auto max-w-full"
            style={{ maxWidth: "min(100%, 450px)" }}
          />
        ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}