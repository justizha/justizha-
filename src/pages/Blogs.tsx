import { Link } from "react-router";
import Nav from "../components/Navigation";

export default function Blogs() {
  return (
    <>
      <Nav />
      <section className="hero  py-8">
        <div className="hero-content flex-col">
          <div>
            <h1 className="text-2xl text-center mb-2">Blog Posts.</h1>
            <img
              loading="lazy"
              src="assets/cat_typing.gif"
              className="w-36"
              alt="me fr"
            />
          </div>
          <Link
            to={"cat"}
            className="border sm:w-lg w-xs text-lg p-3 border-teal-400 hover:bg-base-200 rounded"
          >
            <p>Cat.</p>
            <span className="text-sm text-gray-400">📅 2025-07-12</span>
          </Link>
          <Link
            to={"simplicity"}
            className="border sm:w-lg w-xs text-lg p-3 border-teal-400 hover:bg-base-200 rounded"
          >
            <p>Simplicity</p>
            <span className="text-sm text-gray-400">📅 2025-07-02</span>
          </Link>
        </div>
      </section>
    </>
  );
}
