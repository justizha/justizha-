import Nav from "../components/Navigation";
import { Link } from "react-router";

export default function Blogs() {
  return (
    <>
      <Nav />
      <section className="hero font-mono py-24">
        <div className="hero-content flex-col">
          <div className="mb-4">
            <h1 className="text-xl text-center">Blog Posts.</h1>
          </div>
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
