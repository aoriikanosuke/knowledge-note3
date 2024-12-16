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

/**
 * 記事新規作成時の処理の関数
 */
export const articlesNew = () => {
  const app = document.querySelector('#app');
  // templates/articles/new.html を <div id="content"></div> 要素内に出力する
  app.innerHTML = mustache.render(html, {});

  // TODO: new.htmlにかかれているHTMLに入力の変更があったら画面右側のプレビューの内容を入力した内容に応じたものに変換する
  // 処理...
    // テキストエリアとプレビューエリアを取得
  const textarea = document.getElementById('editor-textarea');
  const previewArea = document.getElementById('preview-area');

  // テキストエリアの内容をプレビューエリアに表示する関数
  function updatePreview() {
    const textContent = textarea.value;  // テキストエリアの内容をプレーンテキストとして表示
    previewArea.innerHTML =marked.parse(textContent);
  }

  // テキストエリアの内容が変更されたときにプレビューを更新
  textarea.addEventListener('input', updatePreview);
  
  // "公開" ボタンを押下された際にPOSTメソッドで /api/v1/articles に対してAPI通信を fetch で送信する
  // "公開"ボタンを取得
  const publishButton = document.getElementById('publish-button');

  // "公開"ボタンがクリックされたときの処理
  publishButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const articleContent = textarea.value; // テキストエリアの内容（Markdown）
    const title = document.getElementById('title').value; // 記事のタイトルを取得（例）

    // 送信するデータ
    const data = {
      title: title,
      body: articleContent
    };

    try {
      const response = await fetch('/api/v1/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON形式で送信
        },
        body: JSON.stringify(data) // データをJSON文字列に変換
      });

      // レスポンスの処理
      if (response.ok) {
        const responseData = await response.json();
        // 成功時の処理（例: 記事作成成功メッセージの表示）
        alert('記事が公開されました!');
      } else {
        // エラーハンドリング
        const errorData = await response.json();
        alert(`エラーが発生しました: ${errorData.message}`);
      }
    } catch (error) {
      // ネットワークエラー等のエラーハンドリング
      console.error('API通信に失敗しました:', error);
      alert('通信エラーが発生しました。再度お試しください。');
    }
    // 呼び出した関数を実行する。引数は遷移したいパスをスラッシュから入力
    navigate('/mypage');
  });
  
};
