import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import Footer from './components/Footer.tsx';
import Blogs from './pages/Blogs.tsx';
import Page from './pages/Page.tsx';

const Music = lazy(() => import('./pages/Music.tsx'));
const Post = lazy(() => import('./pages/blogs/Post'));

createRoot(
  document.getElementById('root') || document.createElement('div')
).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="lastfm" element={<Page />} />
          <Route index element={<App />} />
          <Route path="music" element={<Music />} />

          <Route path="blog">
            <Route index element={<Blogs />} />
            <Route path=":slug" element={<Post />} />
          </Route>
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);