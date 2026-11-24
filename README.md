# justizha.

My personal website for blog posts, music, and the occasional hobby project.

## Features

- Personal introduction and contact links
- Markdown-based blog posts
- Last.fm listening history and monthly top tracks/artists
- Responsive interface with Tailwind CSS and daisyUI
- Audio, GIF, and other hobby content
- Cloudflare Worker proxy for Last.fm API requests

## Tech stack

- Preact
- TypeScript
- Vite
- Tailwind CSS
- daisyUI
- React Markdown
- SWR
- wouter
- Cloudflare Workers

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js
- A [Last.fm API key](https://www.last.fm/api) for the music page

### Installation

```bash
git clone https://github.com/justizha/justizha-.git
cd justizha-
bun install
```

### Environment variables

Create a `.env` file for local development:

```dotenv
VITE_USER_NAME=your_lastfm_username
VITE_LASTFM_API_KEY=your_lastfm_api_key
```

For Cloudflare deployment, configure `LASTFM_API_KEY` as a Worker environment variable or secret instead of exposing it through the client.

### Development

```bash
bun run dev
```

### Production build

```bash
bun run build
bun run preview
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite development server |
| `bun run build` | Type-check and build the production site |
| `bun run preview` | Preview the production build locally |

## Project structure

```text
src/
├── components/       # Shared UI components
├── pages/            # Home, blog, and music pages
│   └── blogs/        # Markdown posts and post rendering
├── service/          # Last.fm API integration
├── types/            # Shared TypeScript types
└── App.tsx           # Application entry component
worker/               # Cloudflare Worker API proxy
public/               # Static assets and audio
```

## License

This is a personal project. All rights reserved unless otherwise noted.
