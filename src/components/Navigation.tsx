import { Link, useLocation } from "react-router";

export default function Nav() {
  const location = useLocation();

  return (
    <header className="flex justify-center mt-4">
      <nav>
        <ul className="flex  items-center font-mono">
          <i className="text-white">•</i>
          <li>
            <Link
              to={"/blog"}
              className={`btn text-lg btn-link ${
                location.pathname === "/blog"
                  ? "text-teal-500"
                  : "text-teal-600 hover:text-teal-500"
              }`}
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              to={"/music"}
              className={`btn text-lg btn-link ${
                location.pathname === "/music"
                  ? "text-teal-500"
                  : "text-teal-600 hover:text-teal-500"
              }`}
            >
              Music
            </Link>
          </li>
          <li>
            <Link
              to={"/"}
              className={`btn text-lg btn-link ${
                location.pathname === "/"
                  ? "text-teal-500"
                  : "text-teal-600 hover:text-teal-500"
              }`}
            >
              Home
            </Link>
          </li>
          <i className="text-white">•</i>
        </ul>
      </nav>
    </header>
  );
}
