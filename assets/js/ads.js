/* どんぐりラボ — AdSense 共通ローダー
 *
 * ■ やること（設定は下の SLOTS だけ）
 *   1. AdSense管理画面 → 広告 → 広告ユニットごと → ディスプレイ広告 を作成
 *   2. 発行される「広告ユニットID」（data-ad-slot の10桁の数字）をコピー
 *   3. 下の SLOTS に貼る。default だけ埋めれば全ページで表示が始まります
 *
 * ■ 設計意図
 *   ・スロット未設定のときは <ins> を一切生成しない。
 *     空の広告枠は「レイアウトだけ崩れて収益ゼロ」になるので、出さない方がよい。
 *   ・1ページに複数枠を置けるが、同じ枠を二重に初期化しないようにしている
 *     （AdSenseは同一要素へのpushを重複させるとエラーになる）。
 *   ・置き場所は HTML 側に <div data-ad="キー"></div> を書くだけ。
 */
(function () {
  "use strict";

  var CLIENT = "ca-pub-6259976488060504";

  // ▼▼▼ ここに広告ユニットIDを貼るだけ ▼▼▼
  var SLOTS = {
    default: ""      // 例: "1234567890"
    // ページごとに変えたい場合はキーを足す:
    // article: "1234567890",
    // tool:    "0987654321"
  };
  // ▲▲▲ ここまで ▲▲▲

  function slotFor(key) {
    return (key && SLOTS[key]) || SLOTS.default || "";
  }

  function mount(box) {
    if (box.dataset.adDone === "1") return;

    var slot = slotFor(box.getAttribute("data-ad"));
    if (!slot) return;                 // 未設定なら何も描画しない

    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", CLIENT);
    ins.setAttribute("data-ad-slot", slot);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");

    box.appendChild(ins);
    box.dataset.adDone = "1";

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSenseスクリプトがブロックされている環境では静かに諦める
    }
  }

  function scan() {
    var boxes = document.querySelectorAll("[data-ad]");
    for (var i = 0; i < boxes.length; i++) mount(boxes[i]);
  }

  // 動的に結果画面を出すページ（おみくじ等）でも拾えるように、
  // 表示されたタイミングで初期化する。
  window.ishiharaAds = { refresh: scan };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }
})();
