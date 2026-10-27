import { useRef } from 'react';

type IconProps = { className?: string };

// Brand icons from Simple Icons (CC0). They use currentColor, so CSS can recolor them.
function MailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function SpotifyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}

const LINKS = [
  {
    name: 'Email',
    handle: 'alfathizhaaaaaaa@gmail.com',
    href: 'mailto:alfathizhaaaaaaa@gmail.com',
    icon: MailIcon,
    external: false,
  },
  {
    name: 'GitHub',
    handle: 'justizha',
    href: 'https://github.com/justizha',
    icon: GithubIcon,
    external: true,
  },
  {
    name: 'Spotify',
    handle: 'Profile',
    href: 'https://open.spotify.com/user/31sg4u2iwexudonkopwhqckghd3u?si=0777b9ac7dc74002',
    icon: SpotifyIcon,
    external: true,
  },
  {
    name: 'X',
    handle: '@ThisIzha',
    href: 'https://twitter.com/ThisIzha',
    icon: XIcon,
    external: true,
  },
];

export default function Contact() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="w-full rounded-none btn btn-outline text-lg font-normal btn-accent"
      >
        Contact
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box rounded-none border border-teal-900 bg-base-200">
          <form method="dialog">
            <button
              type="submit"
              aria-label="Close"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>

          <h3 className="text-xl font-bold text-gray-100">Socials & Contacts</h3>
          <p className="mt-1 text-sm text-gray-400">
            Please read{' '}
            <a
              href="https://nohello.net/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 underline hover:text-teal-200"
            >
              nohello.net
            </a>{' '}
            before messaging.
          </p>

          <ul className="mt-5 border border-teal-900">
            {LINKS.map((link) => (
              <li
                key={link.name}
                className="border-b border-teal-900/50 last:border-b-0"
              >
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group flex items-center gap-4 px-4 py-3 text-gray-200 transition-colors hover:bg-base-300/40 hover:text-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current"
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{link.name}</span>
                  <span className="ml-auto min-w-0 truncate text-sm text-gray-400 transition-colors group-hover:text-teal-300/80">
                    {link.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button type="submit" aria-label="Close">
            close
          </button>
        </form>
      </dialog>
    </>
  );
}