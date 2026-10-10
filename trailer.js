/* Trailer section for case-study and project pages.
   Priority on each page's #showcase section:
     1. data-src="assets/trailers/<slug>.mp4"  (optional data-poster, data-captions)
     2. data-embed="https://..."               (YouTube, Vimeo, Loom, Drive only)
     3. an <ol class="trailer-slides"> inside the section: a formatted slide reel for products
        that have no public live platform to film
     4. ?trailer=preview shows an empty frame, for layout review
   With none of these the section stays hidden. No autoplay for video. The slide reel advances
   by itself only when in view and motion is allowed, and every control is a real button.
   No analytics events. Colors and radius come from the page, so each skin is kept. */
(function () {
  'use strict';
  var sec = document.getElementById('showcase');
  if (!sec) return;
  var src = sec.getAttribute('data-src') || '';
  var embed = sec.getAttribute('data-embed') || '';
  var poster = sec.getAttribute('data-poster') || '';
  var captions = sec.getAttribute('data-captions') || '';
  var title = sec.getAttribute('data-title') || 'Trailer';
  var preview = /[?&]trailer=preview(&|$)/.test(location.search);
  var slideList = sec.querySelector('.trailer-slides');

  var EMBED_HOSTS = ['www.youtube-nocookie.com', 'www.youtube.com', 'player.vimeo.com', 'www.loom.com', 'drive.google.com'];
  function okEmbed(u) {
    try { var x = new URL(u); return x.protocol === 'https:' && EMBED_HOSTS.indexOf(x.hostname) > -1; } catch (e) { return false; }
  }
  var hasEmbed = !!(embed && okEmbed(embed));
  var mode = src ? 'video' : hasEmbed ? 'embed' : slideList ? 'slides' : preview ? 'preview' : '';
  if (!mode) return;

  function css(sel, prop) {
    var el = document.querySelector(sel);
    return el ? getComputedStyle(el)[prop] : '';
  }
  function solid(c) { return c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)' ? c : ''; }
  var bodyCS = getComputedStyle(document.body);
  var ink = bodyCS.color;
  var paper = solid(bodyCS.backgroundColor) || '#fff';
  var edge = solid(css('.stat', 'borderTopColor')) || solid(css('.card', 'borderTopColor')) || solid(css('.callout', 'borderTopColor')) || ink;
  var surface = solid(css('.callout', 'backgroundColor')) || solid(css('.card', 'backgroundColor')) || paper;
  var accent = solid(css('.lnk', 'color')) || solid(css('.label-strong', 'color')) || ink;
  var radius = css('.card', 'borderRadius') || '0px';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var frame = sec.querySelector('.trailer-frame');
  if (!frame) return;
  var baseFrame = 'position:relative;width:100%;overflow:hidden;background:' + surface + ';border:1px solid ' + edge +
    ';border-radius:' + radius + ';color:' + ink + ';';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* ───────── video, embed, preview ───────── */
  if (mode === 'video' || mode === 'embed' || mode === 'preview') {
    frame.style.cssText = baseFrame + 'aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;';
    if (mode === 'video') {
      var v = document.createElement('video');
      v.controls = true; v.preload = 'metadata'; v.setAttribute('playsinline', '');
      if (poster) v.poster = poster;
      v.setAttribute('aria-label', title);
      v.style.cssText = 'width:100%;height:100%;background:#000;object-fit:contain;display:block;';
      var s = document.createElement('source');
      s.src = src; s.type = /\.webm$/i.test(src) ? 'video/webm' : 'video/mp4';
      v.appendChild(s);
      if (captions) {
        var t = document.createElement('track');
        t.kind = 'captions'; t.src = captions; t.srclang = 'en'; t.label = 'English'; t.default = true;
        v.appendChild(t);
      }
      frame.appendChild(v);
    } else if (mode === 'embed') {
      var f = document.createElement('iframe');
      f.src = embed; f.title = title; f.loading = 'lazy'; f.allowFullscreen = true;
      f.setAttribute('allow', 'fullscreen; picture-in-picture');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      frame.appendChild(f);
    } else {
      var wrap = el('div');
      wrap.style.cssText = 'text-align:center;padding:24px;';
      var NS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', '56'); svg.setAttribute('height', '56'); svg.setAttribute('viewBox', '0 0 56 56');
      svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', accent); svg.setAttribute('stroke-width', '2');
      svg.setAttribute('aria-hidden', 'true');
      var box = document.createElementNS(NS, 'rect');
      box.setAttribute('x', '1'); box.setAttribute('y', '1'); box.setAttribute('width', '54'); box.setAttribute('height', '54');
      var tri = document.createElementNS(NS, 'path');
      tri.setAttribute('d', 'M22 17 L40 28 L22 39 Z');
      svg.appendChild(box); svg.appendChild(tri);
      var msg = el('p', '', 'Trailer preview. The 60-second video will play here.');
      msg.style.cssText = 'margin:16px 0 0;font-size:15px;opacity:.75;';
      wrap.appendChild(svg); wrap.appendChild(msg);
      frame.appendChild(wrap);
      frame.setAttribute('role', 'img');
      frame.setAttribute('aria-label', 'Trailer preview frame');
    }
  }

  /* ───────── slide reel ───────── */
  if (mode === 'slides') {
    var slides = Array.prototype.map.call(slideList.children, function (li) {
      return {
        kicker: li.getAttribute('data-kicker') || '',
        stat: li.getAttribute('data-stat') || '',
        head: (li.querySelector('b') || {}).textContent || '',
        sub: (li.querySelector('span') || {}).textContent || ''
      };
    }).filter(function (x) { return x.head; });
    slideList.style.display = 'none';
    if (!slides.length) return;

    var style = document.createElement('style');
    style.textContent =
      '.tl{container-type:inline-size;display:flex;flex-direction:column;aspect-ratio:2/1;border-color:var(--tl-edge) !important;}' +
      '@media (max-width:640px){.tl{aspect-ratio:auto;min-height:360px;}}' +
      '.tl-stage{flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:6cqw 7cqw 2cqw;min-height:0;}' +
      '.tl-kicker{font-size:clamp(10px,1.6cqw,13px);letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:var(--tl-accent);}' +
      '.tl-stat{font-size:clamp(40px,12cqw,120px);line-height:1;font-weight:800;color:var(--tl-accent);}' +
      '.tl-head{font-size:clamp(22px,4.6cqw,58px);line-height:1.12;font-weight:700;max-width:22ch;margin:0;}' +
      '.tl-sub{font-size:clamp(14px,2cqw,22px);line-height:1.5;opacity:.82;max-width:48ch;margin:0;}' +
      '.tl-bar{display:flex;align-items:center;gap:10px;padding:10px 3cqw 12px;border-top:1px solid var(--tl-edge);}' +
      '.tl-seg{flex:1;height:44px;background:none;border:0;padding:0;cursor:pointer;position:relative;}' +
      '.tl-seg::before{content:"";position:absolute;left:0;right:0;top:50%;height:3px;margin-top:-1.5px;background:var(--tl-edge);}' +
      '.tl-seg[aria-current="true"]::before{background:var(--tl-accent);height:5px;margin-top:-2.5px;}' +
      '.tl-seg.done::before{background:var(--tl-accent);opacity:.55;}' +
      '.tl-btn{min-width:44px;height:44px;background:none;border:1px solid var(--tl-edge);color:inherit;cursor:pointer;font:inherit;font-size:22px;line-height:1;border-radius:var(--tl-radius);}' +
      '.tl-btn:hover{border-color:var(--tl-accent);color:var(--tl-accent);}' +
      '.tl-seg:focus-visible,.tl-btn:focus-visible{outline:2px solid var(--tl-accent);outline-offset:2px;}' +
      '.tl-count{font-size:13px;opacity:.7;min-width:3.4em;text-align:center;font-variant-numeric:tabular-nums;}' +
      '.tl-stage>*{transition:opacity .28s ease,transform .28s ease;}' +
      '.tl.tl-swap .tl-stage>*{opacity:0;transform:translateY(8px);}' +
      '@media (prefers-reduced-motion:reduce){.tl-stage>*{transition:none;}.tl.tl-swap .tl-stage>*{transform:none;}}';
    document.head.appendChild(style);

    frame.style.cssText = baseFrame;
    frame.className = 'trailer-frame tl';
    frame.style.setProperty('--tl-accent', accent);
    frame.style.setProperty('--tl-edge', 'color-mix(in srgb, ' + ink + ' 24%, transparent)');
    frame.style.setProperty('--tl-radius', radius);
    frame.setAttribute('role', 'group');
    frame.setAttribute('aria-roledescription', 'carousel');
    frame.setAttribute('aria-label', title);

    var stage = el('div', 'tl-stage');
    stage.setAttribute('aria-live', 'off');
    var bar = el('div', 'tl-bar');
    var prev = el('button', 'tl-btn', '‹'); prev.type = 'button'; prev.setAttribute('aria-label', 'Previous slide');
    var toggle = el('button', 'tl-btn', '❚❚'); toggle.type = 'button';
    var next = el('button', 'tl-btn', '›'); next.type = 'button'; next.setAttribute('aria-label', 'Next slide');
    var segs = slides.map(function (sl, i) {
      var b = el('button', 'tl-seg'); b.type = 'button'; b.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ': ' + sl.head);
      b.addEventListener('click', function () { go(i, true); });
      return b;
    });
    var count = el('span', 'tl-count');
    bar.appendChild(prev); bar.appendChild(toggle); bar.appendChild(next);
    segs.forEach(function (b) { bar.appendChild(b); });
    bar.appendChild(count);
    frame.appendChild(stage); frame.appendChild(bar);

    var idx = 0, timer = null, playing = false, inView = false, held = false;
    var DWELL = 5600;
    function paint() {
      stage.textContent = '';
      var sl = slides[idx];
      if (sl.kicker) stage.appendChild(el('div', 'tl-kicker', sl.kicker));
      if (sl.stat) stage.appendChild(el('div', 'tl-stat', sl.stat));
      stage.appendChild(el('p', 'tl-head', sl.head));
      if (sl.sub) stage.appendChild(el('p', 'tl-sub', sl.sub));
      segs.forEach(function (b, i) {
        if (i === idx) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        b.classList.toggle('done', i < idx);
      });
      count.textContent = (idx + 1) + ' / ' + slides.length;
    }
    function go(i, user) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === idx && !user) return;
      if (user) { setPlaying(false); }
      idx = i;
      if (reduced) { paint(); return; }
      frame.classList.add('tl-swap');
      setTimeout(function () { paint(); frame.classList.remove('tl-swap'); }, 160);
    }
    function schedule() {
      clearTimeout(timer);
      if (!playing || held || !inView) return;
      timer = setTimeout(function () {
        if (idx >= slides.length - 1) { setPlaying(false); return; }
        go(idx + 1, false); schedule();
      }, DWELL);
    }
    function setPlaying(p) {
      playing = p;
      toggle.textContent = p ? '❚❚' : '▶';
      toggle.setAttribute('aria-label', p ? 'Pause the trailer' : (idx >= slides.length - 1 ? 'Replay the trailer' : 'Play the trailer'));
      stage.setAttribute('aria-live', p ? 'off' : 'polite');
      schedule();
    }
    prev.addEventListener('click', function () { go(idx - 1, true); });
    next.addEventListener('click', function () { go(idx + 1, true); });
    toggle.addEventListener('click', function () {
      if (!playing && idx >= slides.length - 1) { idx = 0; paint(); }
      setPlaying(!playing);
    });
    frame.addEventListener('mouseenter', function () { held = true; clearTimeout(timer); });
    frame.addEventListener('mouseleave', function () { held = false; schedule(); });
    frame.addEventListener('focusin', function () { held = true; clearTimeout(timer); });
    frame.addEventListener('focusout', function () { held = false; schedule(); });
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(idx + 1, true); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(idx - 1, true); e.preventDefault(); }
    });
    paint();
    setPlaying(false);
    if ('IntersectionObserver' in window && !reduced) {
      new IntersectionObserver(function (en) {
        var was = inView;
        inView = en[0].isIntersecting && en[0].intersectionRatio > 0.5;
        if (inView && !was && idx === 0 && !playing && !frame.getAttribute('data-started')) {
          frame.setAttribute('data-started', '1');
          setPlaying(true);
        } else { schedule(); }
      }, { threshold: [0, 0.5, 0.75] }).observe(frame);
    }
    var note0 = sec.querySelector('.trailer-note');
    if (note0) note0.textContent = 'A short, formatted walk-through of the case. Use the arrows or the bar to move. The full case study follows below.';
  }

  var note = sec.querySelector('.trailer-note');
  if (note) note.style.cssText = 'margin:16px 0 0;font-size:15px;line-height:1.55;opacity:.78;max-width:60ch;';

  sec.style.display = '';
  sec.style.scrollMarginTop = '80px';
  var navRight = document.querySelector('nav .nav-right');
  var first = navRight && navRight.querySelector('.nav-link');
  if (navRight && first) {
    var a = document.createElement('a');
    a.href = '#showcase'; a.className = first.className.replace(/\bnav-link--active\b/, '').trim(); a.textContent = 'Trailer';
    navRight.insertBefore(a, first);
  }
})();
