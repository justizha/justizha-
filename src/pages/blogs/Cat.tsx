import MDEditor from "@uiw/react-md-editor";
import { Link } from "react-router";
import ContentMarkDown from "./markdown/Cat.md?raw";

export default function Cat() {
  return (
    <main className="hero font-mono pb-18">
      <div className="sm:px-2 px-8 pt-10">
        <Link to={"/blog"} className="btn btn-soft">
          ← Back
        </Link>
        <article className="prose mt-5 ">
          <MDEditor.Markdown
            source={ContentMarkDown}
            style={{
              backgroundColor: "transparent",
              fontFamily: "monospace",
            }}
          />
        </article>
      </div>
    </main>
  );
}
