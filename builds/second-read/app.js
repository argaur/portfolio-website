(function () {
  var root = document.documentElement;
  var q = new URLSearchParams(location.search);
  var NOTES = {
    'wasteful': ['Right', 'Decides the line was not worth the cost. The story shows no cost.'],
    'stranded': ['Left', 'Assumes riders have no other way to work. The story names none.'],
    'runaway': ['Right', 'Says spending was out of control, but gives no figure.'],
    'common sense': ['Right', 'Treats one side of a split vote as the obvious choice.'],
    'abandoned': ['Left', 'Turns a budget vote into a broken duty.'],
    'hollow': ['Left', 'The reporter judges the promise before it is tested.']
  };
  var GLYPHS = '<i class="rule" aria-hidden="true"></i><i class="staff" aria-hidden="true"></i><i class="pennant" aria-hidden="true"></i>';
  var story = document.getElementById('story');
  var marks = [].slice.call(story.querySelectorAll('.mark'));
  var claims = [].slice.call(document.querySelectorAll('#claims .claim'));
  var action = document.getElementById('action');
  var dock = document.querySelector('.dock');
  var live = document.getElementById('live');
  var read = { bias: false, fact: false };
  var tab = 'bias', note = null, opener = null;
  var STEP = parseInt(getComputedStyle(root).getPropertyValue('--hoist-step'), 10);

  function calm() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  marks.forEach(function (m) {
    m.insertAdjacentHTML('beforeend', GLYPHS);
    m.addEventListener('click', function () { if (m.classList.contains('up')) toggleNote(m); });
    m.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && m.classList.contains('up')) { e.preventDefault(); toggleNote(m); }
    });
  });

  function arm(m, on) {
    m.classList.toggle('up', on);
    if (on) {
      var n = NOTES[m.dataset.id];
      m.setAttribute('role', 'button'); m.tabIndex = 0;
      m.setAttribute('aria-expanded', 'false');
      m.setAttribute('aria-label', m.dataset.id + ', ' + n[0] + ' flag. Show note.');
    } else {
      ['role', 'tabindex', 'aria-expanded', 'aria-label'].forEach(function (a) { m.removeAttribute(a); });
    }
  }

  function closeNote(refocus, instant) {
    if (!note) return;
    var old = note;
    note = null;
    if (instant || calm()) { old.remove(); }
    else {
      old.classList.add('furl');
      old.addEventListener('animationend', function () { old.remove(); });
      setTimeout(function () { old.remove(); }, 200);
    }
    if (opener) { opener.setAttribute('aria-expanded', 'false'); if (refocus) opener.focus(); opener = null; }
  }

  function toggleNote(m) {
    if (opener === m) { closeNote(true); return; }
    closeNote(false, true);
    var n = NOTES[m.dataset.id];
    note = document.createElement('div');
    note.className = 'note';
    note.dataset.side = n[0].toLowerCase();
    note.innerHTML = '<b>' + n[0] + '</b><p>' + n[1] + '</p><button type="button" aria-label="Close note"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="2"/></svg></button>';
    note.querySelector('button').addEventListener('click', function () { closeNote(true); });
    m.closest('p, h2').after(note);
    var s = story.getBoundingClientRect(), r = m.getBoundingClientRect();
    if (window.innerWidth < 560) {
      note.classList.add('bleed');
      note.style.left = -s.left + 'px';
    } else {
      var w = note.offsetWidth;
      var left = n[0] === 'Left' ? r.left - s.left : r.right - s.left - w;
      note.style.left = Math.max(0, Math.min(left, s.width - w)) + 'px';
    }
    note.style.top = (r.bottom - s.top + 9) + 'px';
    m.setAttribute('aria-expanded', 'true');
    opener = m;
    live.textContent = n[0] + '. ' + n[1];
    // A note must never open behind the phone dock.
    var limit = getComputedStyle(dock).position === 'fixed' ? dock.getBoundingClientRect().top : window.innerHeight;
    var over = note.getBoundingClientRect().bottom + 12 - limit;
    if (over > 0) window.scrollBy({ top: over, behavior: calm() ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function (e) {
    if (note && !note.contains(e.target) && !e.target.closest('.mark.up')) closeNote(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNote(true); });

  function paintAction() {
    action.textContent = read[tab] ? 'Read it clean' : 'Read it again';
  }

  function setFlags(on, silent) {
    read.bias = on;
    closeNote(false, true);
    marks.forEach(function (m) {
      // Raised in left and right pairs down the article. Lowered all at once, headline included.
      m.style.setProperty('--at', on && !silent ? Number(m.dataset.pair || 0) * STEP + 'ms' : '0ms');
      arm(m, on);
    });
    if (!silent) live.textContent = on ? 'Flags added in both directions.' : 'Flags lowered.';
    paintAction();
  }

  function setVerdicts(on, silent) {
    read.fact = on;
    claims.forEach(function (c, i) {
      c.style.setProperty('--at', on && !silent ? i * STEP + 'ms' : '0ms');
      c.classList.toggle('shown', on);
    });
    if (!silent) live.textContent = on ? 'Verdicts shown.' : 'Verdicts hidden.';
    paintAction();
  }

  function raise() { if (tab === 'bias') setFlags(true); else setVerdicts(true); }

  action.addEventListener('click', function () {
    if (read[tab]) { if (tab === 'bias') setFlags(false); else setVerdicts(false); return; }
    var target = tab === 'bias' ? document.querySelector('#p-bias .cloth') : document.getElementById('claims-top');
    var edge = tab === 'bias' ? 0 : 12;
    var top = target.getBoundingClientRect().top - edge;
    var far = window.innerWidth < 1024 && Math.abs(top) > 4;
    if (!far || calm()) {
      if (far) window.scrollBy({ top: top, behavior: 'auto' });
      raise();
      return;
    }
    var fired = false;
    function go() { if (fired) return; fired = true; raise(); }
    window.addEventListener('scrollend', go, { once: true });
    setTimeout(go, 450);
    window.scrollBy({ top: top, behavior: 'smooth' });
  });

  // Tabs, the selected one stored in the URL
  var tabs = [].slice.call(document.querySelectorAll('.tab[data-to]'));
  var BROKEN = {
    bias: 'News tools label the outlet, but readers meet one article at a time.',
    fact: 'A verdict shown too early changes how the story reads.',
    journalist: 'A single score hides the record it came from.'
  };
  function setTab(id, opts) {
    closeNote(false, true);
    tab = id;
    tabs.forEach(function (t) {
      var on = t.dataset.to === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById('p-' + t.dataset.to).hidden = !on;
    });
    document.getElementById('broken').textContent = BROKEN[id];
    root.dataset.tab = id;
    if (id !== 'journalist') paintAction();
    if (!opts || !opts.silent) {
      try { var u = new URL(location); u.searchParams.set('tab', id); history.replaceState(null, '', u); } catch (e) { /* file:// may refuse */ }
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { setTab(t.dataset.to); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      var n = e.key === 'Home' ? tabs[0] : e.key === 'End' ? tabs[tabs.length - 1] : d ? tabs[(i + d + tabs.length) % tabs.length] : null;
      if (!n) return;
      e.preventDefault();
      n.focus(); setTab(n.dataset.to);
    });
  });

  // Theme switch
  var themes = [document.getElementById('theme')];
  function paintTheme() {
    var dark = root.dataset.theme === 'dark';
    themes.forEach(function (b) {
      b.textContent = dark ? 'Light' : 'Dark';
      b.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme');
    });
    document.getElementById('theme-color').content = getComputedStyle(root).getPropertyValue('--ground').trim();
  }
  themes.forEach(function (b) {
    b.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      paintTheme();
    });
  });

  var lastWidth = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth !== lastWidth) { lastWidth = window.innerWidth; closeNote(false, true); }
  });

  // First paint: the headline carries one flag each way on load.
  root.classList.add('no-anim');
  marks.forEach(function (m) { if (m.hasAttribute('data-onload')) arm(m, true); });
  setTab(['bias', 'fact', 'journalist'].indexOf(q.get('tab')) > -1 ? q.get('tab') : 'bias', { silent: true });
  if (q.get('state') === 'flagged') { setFlags(true, true); setVerdicts(true, true); }
  paintAction();
  paintTheme();
  var want = q.get('note');
  if (want) marks.some(function (m) { if (m.dataset.id === want) { toggleNote(m); return true; } });
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('no-anim'); }); });
})();

// Tells builds apart in PostHog. analytics.js sets the stub first and skips local hosts.
if (window.posthog) window.posthog.register({ build: 'second-read' });
