import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
import html from '../../templates/articles/id.html?raw';
// HTMLを無害化（サニタイズ）するライブラリをインポート
import DOMPurify from 'dompurify';
// Markdown形式の文字列をHTML形式の文字列にするライブラリをインポート
import { parse } from 'marked';
/**
 * 記事新規作成時の処理の関数
 */

export const articlesId = ({ id }) => {
    const app = document.querySelector('#app');

    // fetchを使って記事詳細を取得
    fetch(`/api/v1/articles/${id}`)
        .then((response) => response.json())
        .then((data) => {
            if (!data.isSuccess) {
                throw new Error('記事の取得に失敗しました');
            }

            const { item } = data;  // itemに記事データが含まれている
            const { title, createdAt, updatedAt, user, body } = item;

            // 作成日時と更新日時を整形
            const displayCreatedAt = formatDate(createdAt);
            const displayUpdatedAt = formatDate(updatedAt);

            // テンプレートにデータを埋め込んでレンダリング
            app.innerHTML = mustache.render(html, {
                title,
                createdAt,
                displayCreatedAt,
                updatedAt,
                displayUpdatedAt,
                user,
                body: DOMPurify.sanitize(body)  // HTMLをサニタイズして挿入
            });
        })
        .catch((error) => {
            console.error('Error fetching article data:', error);
            app.innerHTML = '<p>記事の取得に失敗しました。</p>';
        });

    // 日付フォーマット用関数
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    // この記事ページに遷移した後に実行する処理
    return () => {};
};