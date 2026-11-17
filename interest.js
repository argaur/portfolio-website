/* Show interest: a fixed corner button and a small opt-in form.
   Loaded by index.html and services.html only. Case studies, project pages,
   builds and hackathons do not load it (Gaurav, 2026-11-17).
   Replaced the email gate, which was deleted the same day. */
(function () {
  'use strict';

  // Where submissions go. Swap send() when the backend changes.
  var ENDPOINT = window.GG_INTEREST_ENDPOINT || '/api/interest';
  var FALLBACK_EMAIL = 'ar.gaurav20@gmail.com';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function send(payload) {
    if (!ENDPOINT) return Promise.reject(new Error('No endpoint configured'));
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('Send failed with status ' + res.status);
    });
  }

  var css =
    '#gg-interest-btn{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:90;' +
      'display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border:1px solid #8a6f2e;border-radius:0;' +
      'background:#16161e;color:#c9a84c;font:700 12px/1 "Space Mono",monospace;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.35);transition:background .15s,color .15s,border-color .15s;}' +
    '#gg-interest-btn:hover{background:#c9a84c;color:#0e0e12;border-color:#c9a84c;}' +
    '#gg-interest-btn:focus-visible,#gg-interest :focus-visible{outline:2px solid #c9a84c;outline-offset:2px;}' +
    '#gg-interest-btn .gi-dot{width:6px;height:6px;background:currentColor;}' +
    '#gg-interest{width:calc(100% - 32px);max-width:440px;max-height:calc(100dvh - 32px);margin:auto;padding:0;border:1px solid #2a2a38;border-radius:0;' +
      'background:#1a1a22;color:#ece8e2;font:400 15px/1.55 "DM Sans",sans-serif;overflow-y:auto;}' +
    '#gg-interest::backdrop{background:rgba(10,10,14,.85);}' +
    '#gg-interest .gi-in{position:relative;padding:32px 24px 24px;}' +
    '#gg-interest .gi-close{position:absolute;top:4px;right:4px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;' +
      'background:none;border:0;color:#9896a0;cursor:pointer;}' +
    '#gg-interest .gi-close:hover{color:#ece8e2;}' +
    '#gg-interest .gi-kicker{font:700 11px/1 "Space Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#c9a84c;margin:0 0 16px;}' +
    '#gg-interest h2{font:700 22px/1.25 "Space Mono",monospace;margin:0 0 8px;color:#ece8e2;}' +
    '#gg-interest .gi-sub{color:#9896a0;margin:0 0 24px;}' +
    '#gg-interest form{display:flex;flex-direction:column;gap:16px;margin:0;}' +
    '#gg-interest .gi-field{display:flex;flex-direction:column;gap:8px;border:0;margin:0;padding:0;min-width:0;}' +
    '#gg-interest .gi-label{font:400 11px/1 "Space Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#9896a0;padding:0;}' +
    '#gg-interest .gi-label span{text-transform:none;letter-spacing:0;color:#56546e;}' +
    '#gg-interest input[type=email],#gg-interest input[type=text],#gg-interest textarea{width:100%;min-height:44px;padding:10px 12px;border:1px solid #2a2a38;' +
      'border-radius:0;background:#0e0e12;color:#ece8e2;font:400 16px/1.4 "DM Sans",sans-serif;}' +
    '#gg-interest textarea{min-height:72px;resize:vertical;}' +
    '#gg-interest input:focus,#gg-interest textarea:focus{outline:none;border-color:#c9a84c;}' +
    '#gg-interest input[aria-invalid=true]{border-color:#e06c6c;}' +
    '#gg-interest .gi-opt{display:flex;align-items:center;gap:12px;min-height:44px;padding:0 12px;border:1px solid #2a2a38;cursor:pointer;color:#ece8e2;}' +
    '#gg-interest .gi-opt:has(input:checked){border-color:#c9a84c;background:rgba(201,168,76,.06);}' +
    '#gg-interest .gi-opt input{accent-color:#c9a84c;width:16px;height:16px;margin:0;}' +
    '#gg-interest .gi-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}' +
    '#gg-interest .gi-error{min-height:0;margin:0;color:#e06c6c;font-size:14px;}' +
    '#gg-interest .gi-error:empty{display:none;}' +
    '#gg-interest .gi-submit{min-height:44px;padding:0 24px;border:0;border-radius:0;background:#c9a84c;color:#0e0e12;cursor:pointer;' +
      'font:700 12px/1 "Space Mono",monospace;letter-spacing:.1em;text-transform:uppercase;}' +
    '#gg-interest .gi-submit:hover{background:#d4b356;}' +
    '#gg-interest .gi-submit[disabled]{opacity:.6;cursor:wait;}' +
    '#gg-interest .gi-done p{color:#9896a0;margin:0 0 24px;}' +
    /* Light theme: index.html toggles body.theme-light. Darkened gold passes AA on white. */
    'body.theme-light #gg-interest-btn{background:#ffffff;color:#6e5824;border-color:#6e5824;box-shadow:0 8px 24px rgba(14,14,18,.12);}' +
    'body.theme-light #gg-interest-btn:hover{background:#6e5824;color:#f4f0e8;}' +
    'body.theme-light #gg-interest{background:#ffffff;color:#0e0e12;border-color:#d8d3ce;}' +
    'body.theme-light #gg-interest::backdrop{background:rgba(242,237,232,.88);}' +
    'body.theme-light #gg-interest h2,body.theme-light #gg-interest .gi-opt{color:#0e0e12;}' +
    'body.theme-light #gg-interest .gi-kicker{color:#6e5824;}' +
    'body.theme-light #gg-interest .gi-sub,body.theme-light #gg-interest .gi-label,body.theme-light #gg-interest .gi-done p,body.theme-light #gg-interest .gi-close{color:#5c5870;}' +
    'body.theme-light #gg-interest .gi-label span{color:#77738a;}' +
    'body.theme-light #gg-interest input[type=email],body.theme-light #gg-interest input[type=text],body.theme-light #gg-interest textarea{background:#f7f3ea;color:#0e0e12;border-color:#d8d3ce;}' +
    'body.theme-light #gg-interest input:focus,body.theme-light #gg-interest textarea:focus,body.theme-light #gg-interest .gi-opt:has(input:checked){border-color:#6e5824;}' +
    'body.theme-light #gg-interest .gi-opt{border-color:#d8d3ce;}' +
    'body.theme-light #gg-interest .gi-opt input{accent-color:#6e5824;}' +
    'body.theme-light #gg-interest .gi-submit{background:#6e5824;color:#f4f0e8;}' +
    'body.theme-light #gg-interest .gi-error{color:#b03a3a;}' +
    'body.theme-light #gg-interest :focus-visible,body.theme-light #gg-interest-btn:focus-visible{outline-color:#6e5824;}' +
    '@media print{#gg-interest-btn{display:none;}}';

  var X_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var html =
    '<div class="gi-in">' +
      '<button type="button" class="gi-close" aria-label="Close">' + X_ICON + '</button>' +
      '<div class="gi-form-view">' +
        '<p class="gi-kicker">Show interest</p>' +
        '<h2 id="gg-interest-title">Leave your details</h2>' +
        '<p class="gi-sub">If the work here fits what you need, leave your email. I will get back to you.</p>' +
        '<form novalidate>' +
          '<label class="gi-field"><span class="gi-label">Email</span>' +
            '<input type="email" name="email" autocomplete="email" maxlength="254" required aria-describedby="gg-interest-error"></label>' +
          '<label class="gi-field"><span class="gi-label">Name <span>(optional)</span></span>' +
            '<input type="text" name="name" autocomplete="name" maxlength="100"></label>' +
          '<fieldset class="gi-field"><legend class="gi-label" style="margin-bottom:8px">I am interested in</legend>' +
            '<label class="gi-opt"><input type="radio" name="interest" value="freelance" checked>Freelance or project work</label>' +
            '<label class="gi-opt"><input type="radio" name="interest" value="role">A full-time role</label>' +
            '<label class="gi-opt"><input type="radio" name="interest" value="following">Following your work</label>' +
          '</fieldset>' +
          '<label class="gi-field"><span class="gi-label">Note <span>(optional)</span></span>' +
            '<textarea name="note" maxlength="1000" rows="2" placeholder="What you have in mind"></textarea></label>' +
          '<label class="gi-hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
          '<p class="gi-error" id="gg-interest-error" role="alert"></p>' +
          '<button type="submit" class="gi-submit">Send</button>' +
        '</form>' +
      '</div>' +
      '<div class="gi-done" hidden>' +
        '<p class="gi-kicker">Sent</p>' +
        '<h2>Thanks, it reached me.</h2>' +
        '<p class="gi-done-text"></p>' +
        '<button type="button" class="gi-submit gi-done-close">Close</button>' +
      '</div>' +
    '</div>';

  function init() {
    if (document.getElementById('gg-interest-btn')) return;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'gg-interest-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML = '<span class="gi-dot" aria-hidden="true"></span>Show interest';

    var dlg = document.createElement('dialog');
    dlg.id = 'gg-interest';
    dlg.setAttribute('aria-labelledby', 'gg-interest-title');
    dlg.innerHTML = html;

    document.body.appendChild(btn);
    document.body.appendChild(dlg);

    var form = dlg.querySelector('form');
    var formView = dlg.querySelector('.gi-form-view');
    var done = dlg.querySelector('.gi-done');
    var err = dlg.querySelector('.gi-error');
    var email = form.elements.email;
    var submit = form.querySelector('.gi-submit');

    function close() { dlg.close(); btn.focus(); }

    btn.addEventListener('click', function () {
      if (!done.hidden) { form.reset(); done.hidden = true; formView.hidden = false; }
      err.textContent = '';
      email.removeAttribute('aria-invalid');
      dlg.showModal();
      email.focus();
    });
    dlg.querySelector('.gi-close').addEventListener('click', close);
    dlg.querySelector('.gi-done-close').addEventListener('click', close);
    // A click on the backdrop lands on the dialog element itself
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    email.addEventListener('input', function () { err.textContent = ''; email.removeAttribute('aria-invalid'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = email.value.trim();
      if (!EMAIL_RE.test(value)) {
        err.textContent = 'Enter a valid email address.';
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      // Bots fill the hidden field. Show success and send nothing.
      if (form.elements.website.value) { showDone(value); return; }

      var checked = form.querySelector('input[name=interest]:checked');
      var payload = {
        email: value,
        name: form.elements.name.value.trim().slice(0, 100) || null,
        interest: checked ? checked.value : null,
        note: form.elements.note.value.trim().slice(0, 1000) || null,
        source: (location.pathname + location.hash).slice(0, 200)
      };

      submit.disabled = true;
      submit.textContent = 'Sending';
      err.textContent = '';
      send(payload).then(function () {
        showDone(value);
      }, function (e) {
        console.error('[interest]', e);
        err.textContent = 'That did not send. Try again, or email ' + FALLBACK_EMAIL + '.';
      }).then(function () {
        submit.disabled = false;
        submit.textContent = 'Send';
      });
    });

    function showDone(addr) {
      dlg.querySelector('.gi-done-text').textContent = 'I will reply to ' + addr + '.';
      formView.hidden = true;
      done.hidden = false;
      dlg.querySelector('.gi-done-close').focus();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
