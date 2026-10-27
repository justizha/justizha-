import { NavLink } from "react-router";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Blogs", end: false },
  { to: "/music", label: "Music", end: false },
];

export default function Nav() {
  return (
    <header className="mt-4 flex justify-center">
      <nav aria-label="Main">
        <ul className="flex items-center gap-2 font-mono">
          {LINKS.map((link) => (
            <li key={link.to}>
              {/* `end` stops Home from matching every route; NavLink sets aria-current itself */}
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
                    isActive
                      ? "text-teal-300"
                      : "text-teal-600 hover:text-teal-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Always rendered so the layout doesn't shift when the active page changes */}
                    <span
                      aria-hidden="true"
                      className={isActive ? "opacity-100" : "opacity-0"}
                    >
                      •
                    </span>
                    {link.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}