import { router } from './utils/router';
import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
import html from './templates/sample.html?raw';
import { login } from './pages/login';
import { register } from './pages/register';
// import { article } from './pages/article';

const test = () => document
  .querySelector('#app')
  .insertAdjacentHTML('afterbegin', mustache.render(html, { hoge: 'HOME' }));

router(
  [
    { path: '/', fn: test },
    { path: '/users/:id', fn: (id) => console.log(id) },
    { path: '/articles/:id', fn: ({ id, detail, aa }) => console.log(id, detail, aa) },
    { path: '/register', fn: register },
    { path: '/login', fn: login },
    { path: '/logout', fn: () => { } },
  ],
  {
    onNotFound: () => console.log('NOT FOUND'),
    onError: (e) => console.error(e),
  },
);
