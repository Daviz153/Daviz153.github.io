import { h, Fragment } from "preact"

const css = `
#dvz-doc-fb-wrap { position: fixed; right: 20px; bottom: 20px; z-index: 999999; }
#dvz-doc-fb-btn { position: relative;
  width: 52px; height: 52px; border-radius: 50%;
  background: #4e746b; color: #fff;
  border: none; box-shadow: 0 4px 14px rgba(0,0,0,.25); cursor: pointer;
  display: flex; align-items: center; justify-content: center; }
#dvz-doc-fb-tooltip {
  position: absolute; right: 62px; bottom: 14px;
  background: #262626; color: #fff; padding: 6px 12px;
  border-radius: 6px; font-size: 13px; white-space: nowrap;
  font-family: var(--bodyFont, "Pretendard", -apple-system, sans-serif); font-weight: 700;
  opacity: 0; pointer-events: none; transition: opacity .15s ease;
}
#dvz-doc-fb-tooltip::after {
  content: ''; position: absolute; right: -5px; top: 50%;
  transform: translateY(-50%); border: 5px solid transparent;
  border-left-color: #262626;
}
#dvz-doc-fb-wrap:hover #dvz-doc-fb-tooltip { opacity: 1; }
#dvz-doc-fb-overlay { position: fixed; inset: 0; background: rgba(26,26,26,.55); z-index: 999998; display: none; }
#dvz-doc-fb-modal { position: fixed; right: 20px; bottom: 86px; z-index: 999999; width: 320px;
  max-width: 90vw; background: var(--light); border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2); padding: 18px; display: none;
  font-family: var(--bodyFont, "Pretendard", -apple-system, sans-serif); color: var(--dark); }
#dvz-doc-fb-modal h3 { margin: 0 0 4px; font-size: 15px; font-weight: 800; color: var(--dark); }
#dvz-doc-fb-modal .dvz-doc-fb-sub { font-size: 12px; color: var(--darkgray); margin: 0 0 14px; font-weight: 400; }
#dvz-doc-fb-reactions { display: flex; gap: 8px; margin-bottom: 4px; }
#dvz-doc-fb-reactions button { flex: 1; padding: 8px 0; border: 1px solid var(--lightgray); border-radius: 8px;
  background: var(--light); cursor: pointer; transition: border-color .15s ease, background-color .15s ease;
  display: flex; flex-direction: column; align-items: center; gap: 2px; }
#dvz-doc-fb-reactions .dvz-doc-fb-emoji { font-size: 20px; line-height: 1; }
#dvz-doc-fb-reactions .dvz-doc-fb-label { font-size: 11px; color: var(--darkgray); font-weight: 400; }
#dvz-doc-fb-reactions button:hover { border-color: #4e746b; }
#dvz-doc-fb-reactions button.dvz-selected { border-color: #4e746b; }
html[saved-theme="light"] #dvz-doc-fb-reactions button.dvz-selected { background: rgba(78, 116, 107, 0.12); }
html[saved-theme="dark"] #dvz-doc-fb-reactions button.dvz-selected { background: rgba(132, 165, 157, 0.18); }
#dvz-doc-fb-detail { display: none; margin-top: 12px; }
#dvz-doc-fb-detail textarea, #dvz-doc-fb-detail input[type="text"] {
  width: 100%; box-sizing: border-box; margin-bottom: 10px;
  padding: 8px; border: 1px solid var(--lightgray); border-radius: 6px; font-size: 14px;
  font-family: var(--bodyFont, "Pretendard", -apple-system, sans-serif); font-weight: 400;
  color: var(--dark); background: var(--light); }
#dvz-doc-fb-detail textarea { min-height: 80px; resize: vertical; }
#dvz-doc-fb-modal button.dvz-doc-fb-send { background: #4e746b; color: #fff;
  border: none; padding: 9px 14px; border-radius: 6px; cursor: pointer; font-size: 14px;
  font-weight: 700; width: 100%; }
#dvz-doc-fb-modal button.dvz-doc-fb-send:disabled { background: var(--lightgray); color: var(--darkgray); cursor: not-allowed; }
#dvz-doc-fb-modal button.dvz-doc-fb-close { position: absolute; top: 10px; right: 12px; background: none;
  border: none; font-size: 16px; cursor: pointer; color: var(--darkgray); }
#dvz-doc-fb-status { margin-top: 8px; font-size: 13px; font-weight: 700; }
#dvz-doc-fb-hp { position: absolute !important; left: -9999px !important; width: 1px; height: 1px; opacity: 0; }
`

const script = `
var WEBHOOK_URL = 'https://hook.us1.make.com/0cc2v8j3ki8jbp1tepkjs9fn3dhltqwa';
var RATE_KEY = 'dvz_doc_fb_log';
var MAX_PER_HOUR = 5;
var MAX_LEN = 500;
var EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;

var btn = document.getElementById('dvz-doc-fb-btn');
var overlay = document.getElementById('dvz-doc-fb-overlay');
var modal = document.getElementById('dvz-doc-fb-modal');

if (btn && modal && overlay) {
  var closeBtn = modal.querySelector('.dvz-doc-fb-close');
  var sendBtn = modal.querySelector('.dvz-doc-fb-send');
  var reactionsWrap = document.getElementById('dvz-doc-fb-reactions');
  var reactionBtns = reactionsWrap.querySelectorAll('button');
  var detailWrap = document.getElementById('dvz-doc-fb-detail');
  var msgEl = document.getElementById('dvz-doc-fb-msg');
  var contactEl = document.getElementById('dvz-doc-fb-contact');
  var hpEl = document.getElementById('dvz-doc-fb-hp');
  var status = document.getElementById('dvz-doc-fb-status');

  var selectedValue = null;
  var isSending = false;

  var PLACEHOLDERS = {
    '아쉬움': '어떤 점이 아쉬웠는지 알려주시면 큰 도움이 됩니다. (선택)',
    '요청사항': '문서 오류 신고, 추가로 다뤄줬으면 하는 내용 등 문의/요청 사항을 알려주세요.'
  };
  var DEFAULT_PLACEHOLDER = PLACEHOLDERS['아쉬움'];

  function isDarkMode() {
    return document.documentElement.getAttribute('saved-theme') === 'dark';
  }

  function setStatus(text, kind) {
    var colors = {
      ok: isDarkMode() ? '#6fcf7a' : '#2e7d32',
      err: isDarkMode() ? '#ff6b6b' : '#c0392b',
      info: ''
    };
    status.style.color = colors[kind] || '';
    status.textContent = text;
  }

  function openModal() {
    overlay.style.display = 'block';
    modal.style.display = 'block';
  }
  function closeModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
    setStatus('', 'info');
    selectedValue = null;
    reactionBtns.forEach(function(b) { b.classList.remove('dvz-selected'); });
    detailWrap.style.display = 'none';
    msgEl.value = '';
    msgEl.placeholder = DEFAULT_PLACEHOLDER;
    contactEl.value = '';
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
  });

  function getRecentLog() {
    var list;
    try { list = JSON.parse(localStorage.getItem(RATE_KEY) || '[]'); } catch (e) { list = []; }
    var oneHourAgo = Date.now() - 3600000;
    return list.filter(function(t) { return t > oneHourAgo; });
  }
  function saveLog(list) {
    try { localStorage.setItem(RATE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function sendFeedback(msg, contact) {
    if (hpEl.value || isSending) return;

    var log = getRecentLog();
    if (log.length >= MAX_PER_HOUR) {
      setStatus('너무 많은 피드백을 보내셨습니다. 잠시 후 다시 시도해주세요.', 'err');
      return;
    }

    isSending = true;
    sendBtn.disabled = true;
    setStatus('전송 중...', 'info');

    fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        source: 'wiki_doc_feedback',
        site: window.location.hostname,
        reaction: selectedValue,
        message: msg || '',
        contact: contact || '',
        page_url: window.location.href,
        page_title: document.title,
        submitted_at: new Date().toISOString()
      })
    }).then(function() {
      log.push(Date.now());
      saveLog(log);
      setStatus('전달되었습니다. 감사합니다!', 'ok');
      setTimeout(closeModal, 1200);
    }).catch(function() {
      setStatus('전송 실패. 잠시 후 다시 시도해주세요.', 'err');
    }).finally(function() {
      isSending = false;
      sendBtn.disabled = false;
    });
  }

  reactionBtns.forEach(function(rBtn) {
    rBtn.addEventListener('click', function() {
      selectedValue = rBtn.getAttribute('data-value');
      reactionBtns.forEach(function(b) { b.classList.remove('dvz-selected'); });
      rBtn.classList.add('dvz-selected');

      if (selectedValue === '도움됨') {
        sendFeedback('', '');
      } else {
        msgEl.placeholder = PLACEHOLDERS[selectedValue] || DEFAULT_PLACEHOLDER;
        detailWrap.style.display = 'block';
        msgEl.focus();
      }
    });
  });

  sendBtn.addEventListener('click', function() {
    var msg = msgEl.value.trim().slice(0, MAX_LEN);
    var contact = contactEl.value.trim().slice(0, 100);
    if (contact && !EMAIL_RE.test(contact)) {
      setStatus('이메일 형식을 확인해주세요. (비워두셔도 됩니다)', 'err');
      return;
    }
    sendFeedback(msg, contact);
  });
}
`

const FeedbackWidget = () => {
  return h(
    Fragment,
    null,
    h(
      "div",
      { id: "dvz-doc-fb-wrap" },
      h("span", { id: "dvz-doc-fb-tooltip" }, "이 문서, 도움이 됐나요?"),
      h(
        "button",
        { id: "dvz-doc-fb-btn", "aria-label": "문서 피드백" },
        h(
          "svg",
          {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          h("path", {
            d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
          }),
        ),
      ),
    ),
    h("div", { id: "dvz-doc-fb-overlay" }),
    h(
      "div",
      {
        id: "dvz-doc-fb-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "dvz-doc-fb-title",
      },
      h("button", { class: "dvz-doc-fb-close", "aria-label": "닫기" }, "✕"),
      h("h3", { id: "dvz-doc-fb-title" }, "이 페이지가 도움이 되었나요?"),
      h("p", { class: "dvz-doc-fb-sub" }, "반응을 남기거나, 문의/요청 사항을 알려주세요."),
      h(
        "div",
        { id: "dvz-doc-fb-reactions" },
        h(
          "button",
          { type: "button", "data-value": "도움됨" },
          h("span", { class: "dvz-doc-fb-emoji" }, "👍"),
          h("span", { class: "dvz-doc-fb-label" }, "도움됨"),
        ),
        h(
          "button",
          { type: "button", "data-value": "아쉬움" },
          h("span", { class: "dvz-doc-fb-emoji" }, "👎"),
          h("span", { class: "dvz-doc-fb-label" }, "아쉬움"),
        ),
        h(
          "button",
          { type: "button", "data-value": "요청사항" },
          h("span", { class: "dvz-doc-fb-emoji" }, "✏️"),
          h("span", { class: "dvz-doc-fb-label" }, "요청사항"),
        ),
      ),
      h(
        "div",
        { id: "dvz-doc-fb-detail" },
        h("textarea", {
          id: "dvz-doc-fb-msg",
          maxlength: "500",
          placeholder: "어떤 점이 아쉬웠는지 알려주시면 큰 도움이 됩니다. (선택)",
        }),
        h("input", {
          type: "text",
          id: "dvz-doc-fb-contact",
          maxlength: "100",
          inputmode: "email",
          placeholder: "이메일 (선택)",
        }),
        h("input", {
          type: "text",
          id: "dvz-doc-fb-hp",
          name: "website",
          tabindex: "-1",
          autocomplete: "off",
          "aria-hidden": "true",
        }),
        h("button", { class: "dvz-doc-fb-send" }, "보내기"),
      ),
      h("div", { id: "dvz-doc-fb-status", role: "status" }),
    ),
  )
}

FeedbackWidget.css = css
FeedbackWidget.afterDOMLoaded = script

const FeedbackWidget_default = () => FeedbackWidget

export { FeedbackWidget_default as FeedbackWidget }
