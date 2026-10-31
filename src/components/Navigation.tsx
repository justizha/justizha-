import { Link, useLocation } from 'wouter-preact';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/blog', label: 'Blogs', end: false },
  { to: '/music', label: 'Music', end: false },
];

export default function Nav() {
  const [location] = useLocation();

  return (
    <header className="mt-4 flex justify-center">
      <nav aria-label="Main">
        <ul className="flex items-center gap-2 font-mono">
          {LINKS.map((link) => {
            const isActive = link.end
              ? location === link.to
              : location === link.to || location.startsWith(`${link.to}/`);

            return (
              <li key={link.to}>
                <Link
                  href={link.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
                    isActive
                      ? 'text-teal-300'
                      : 'text-teal-600 hover:text-teal-300'
                  }`}
                >
                  {/* Always rendered so the layout doesn't shift when the active page changes */}
                  <span
                    aria-hidden="true"
                    className={isActive ? 'opacity-100' : 'opacity-0'}
                  >
                    •
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
