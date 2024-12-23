import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
import html from '../../templates/articles/new.html?raw';
import * as marked from 'marked';
// ページ遷移するための関数を呼び出す
import { navigate } from '../../utils/router';

// 当授業ではCSRF攻撃に対して脆弱なコードとなっていますが、実装が煩雑になるので考慮せずに実装しますが
// 実際にログインを伴うサイト等でフォーム送信などを行う処理にはCSRF攻撃に対する対策CSRFトークンも含めるなどの対策を実施してください
// 参考: https://developer.mozilla.org/ja/docs/Glossary/CSRF

// HTMLを無害化（サニタイズ）するライブラリをインポート
import DOMPurify from 'dompurify';
// Markdown形式の文字列をHTML形式の文字列にするライブラリをインポート
import { parse } from 'marked';
// URL遷移するための関数をインポート
import { navigate } from '../../utils/router';

/**
 * 記事新規作成時の処理の関数
 */
export const articlesNew = () => {
  const app = document.querySelector('#app');
  // templates/articles/new.html を <div id="content"></div> 要素内に出力する
  app.innerHTML = mustache.render(html, {});


  /**
   * 入力した本文のMarkdownを画面右側にプレビューするための処理
   * @param {Event} event フォームがsubmitされた際の処理
   */
  const contnetPreview = (event) => {
    // textarea の値を取得
    const value = event.target.value;
    // textarea の値をまずはHTML形式に変換して、その後にHTMLで有害と思わしき処理をトルツメする
    const previewHTML = DOMPurify.sanitize(parse(value));
    // 動作確認
    console.debug(previewHTML);
    // プレビューエリアに反映する
    document.querySelector('#preview-area').innerHTML = previewHTML;
  };

  // id属性が"editor-textarea"な要素が画面に出力されてから実行する必要があるので
  // app.innerHTMLの下に実装する必要がある。
  document.querySelector('#editor-textarea').addEventListener('input', contnetPreview);


  /**
   * コンテンツ保存時の処理
   * @param {Event} event 
   */
  const formSubmit = (event) => {
    // ブラウザ上でページ遷移するのを防ぐ、代わりに後続のJS処理でform送信処理を行う
    event.preventDefault();

    // form 要素内にある name 属性が title と body なフォーム要素を取得する
    const { title, body } = event.target;
    fetch('/api/v1/articles', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ title: title.value, body: body.value }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.isSuccess) {
          navigate('/');
        } else {
          console.error(json);
        }
      });
  };


  // id属性が"articles-new-form"な要素が画面に出力されてから実行する必要があるので
  // app.innerHTMLの下に実装する必要がある。
  document.querySelector('#articles-new-form').addEventListener('submit', formSubmit);

  // このページ /articles/new から遷移する際に実行する処理
  return () => {
    document.querySelector('#editor-textarea').removeEventListener('input', contnetPreview);
    document.querySelector('#articles-new-form').removeEventListener('submit', formSubmit);
  };
};
