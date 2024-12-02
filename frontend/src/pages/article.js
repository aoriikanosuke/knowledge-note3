import mustache from 'mustache';
import html from '../templates/article.html?raw';

export const article = () => {
  const app = document.querySelector('#app');
  app.innerHTML = mustache.render(html);

  document
    .querySelector('#article-form')
    .addEventListener('submit', e => {
      e.preventDefault();
    });
};