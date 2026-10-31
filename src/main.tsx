import './index.css';
import { render } from 'preact';
import { lazy, Suspense } from 'preact/compat';
import { Route, Switch } from 'wouter-preact';
import App from './App.tsx';
import Footer from './components/Footer.tsx';
import Blogs from './pages/Blogs.tsx';
import Page from './pages/Page.tsx';

const Music = lazy(() => import('./pages/Music.tsx'));
const Post = lazy(() => import('./pages/blogs/Post'));

render(
  <>
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={App} />
        <Route path="/lastfm" component={Page} />
        <Route path="/music" component={Music} />
        <Route path="/blog" component={Blogs} />
        <Route path="/blog/:slug" component={Post} />
      </Switch>
    </Suspense>
    <Footer />
  </>,
  document.getElementById('root')!
);