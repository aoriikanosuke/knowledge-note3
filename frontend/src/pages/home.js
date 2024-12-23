import mustache from 'mustache';
import html from '../templates/home.html?raw';

export const home = () => {
  fetch('/api/v1/articles', {
    method: 'GET'
  })
  .then(Response => Response.json())
  .then(json => {
    const app = document.querySelector('#app');
    app.innerHTML = mustache.render(html, {
      articles: json.items.map(item => {
        const dateObject = new Date(item.createdAt);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const date = dateObject.getDate();
        item.createdAt=`${year}年${month}月${date}日`;
        return item;
      })
    });
  });
};
